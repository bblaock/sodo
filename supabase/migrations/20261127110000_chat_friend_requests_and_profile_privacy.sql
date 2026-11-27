-- SODO Chat: friendship gate and least-privilege profile discovery.
create table if not exists public.chat_friend_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  addressee_id uuid not null references auth.users(id) on delete cascade,
  pair_low uuid not null references auth.users(id) on delete cascade,
  pair_high uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','rejected')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  constraint chat_friend_requests_distinct_users check (requester_id <> addressee_id),
  constraint chat_friend_requests_pair_order check (pair_low < pair_high),
  constraint chat_friend_requests_pair_matches check (
    pair_low = least(requester_id, addressee_id)
    and pair_high = greatest(requester_id, addressee_id)
  ),
  constraint chat_friend_requests_response_time check (
    (status = 'pending' and responded_at is null)
    or (status in ('accepted','rejected') and responded_at is not null)
  ),
  constraint chat_friend_requests_unique_pair unique (pair_low, pair_high)
);

-- Existing one-to-one conversations represent an already-established relationship.
-- Preserve them and grandfather the pair as accepted; no messages or conversations are deleted.
insert into public.chat_friend_requests
  (requester_id, addressee_id, pair_low, pair_high, status, created_at, responded_at)
select c.user_one, c.user_two, c.user_one, c.user_two, 'accepted', c.created_at, c.created_at
from public.chat_conversations c
on conflict (pair_low, pair_high) do nothing;

alter table public.chat_friend_requests enable row level security;
alter table public.chat_friend_requests force row level security;
create index chat_friend_requests_requester_status_idx
  on public.chat_friend_requests (requester_id, status, created_at desc);
create index chat_friend_requests_addressee_status_idx
  on public.chat_friend_requests (addressee_id, status, created_at desc);

do $
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'chat_friend_requests'
  ) then
    alter publication supabase_realtime add table public.chat_friend_requests;
  end if;
end;
$;

revoke all on table public.chat_friend_requests from public, anon;
grant select, insert, update on table public.chat_friend_requests to authenticated;

drop policy if exists "chat friend requests visible to participants" on public.chat_friend_requests;
create policy "chat friend requests visible to participants"
on public.chat_friend_requests for select to authenticated
using ((select auth.uid()) in (requester_id, addressee_id));

drop policy if exists "users send their own friend requests" on public.chat_friend_requests;
create policy "users send their own friend requests"
on public.chat_friend_requests for insert to authenticated
with check (
  requester_id = (select auth.uid())
  and requester_id <> addressee_id
  and status = 'pending'
  and responded_at is null
);

drop policy if exists "participants respond or retry rejected requests" on public.chat_friend_requests;
create policy "participants respond or retry rejected requests"
on public.chat_friend_requests for update to authenticated
using (
  (addressee_id = (select auth.uid()) and status = 'pending')
  or ((select auth.uid()) in (requester_id, addressee_id) and status = 'rejected')
)
with check (
  (addressee_id = (select auth.uid()) and status in ('accepted','rejected'))
  or (requester_id = (select auth.uid()) and status = 'pending')
);

create or replace function public.guard_chat_friend_request_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id is distinct from old.id
    or new.pair_low is distinct from old.pair_low
    or new.pair_high is distinct from old.pair_high
    then
    raise exception 'Friend request identity fields cannot be changed';
  end if;

  if old.status = 'pending'
    and old.addressee_id = (select auth.uid())
    and new.requester_id = old.requester_id
    and new.addressee_id = old.addressee_id
    and new.status in ('accepted','rejected')
    and new.responded_at is not null then
    return new;
  end if;

  if old.status = 'rejected'
    and (select auth.uid()) in (old.requester_id, old.addressee_id)
    and new.requester_id = (select auth.uid())
    and new.addressee_id = case
      when old.requester_id = (select auth.uid()) then old.addressee_id
      else old.requester_id
    end
    and new.status = 'pending'
    and new.created_at >= old.created_at
    and new.responded_at is null then
    return new;
  end if;

  raise exception 'Invalid friend request state transition';
end;
$$;

drop trigger if exists chat_friend_request_update_guard on public.chat_friend_requests;
create trigger chat_friend_request_update_guard
before update on public.chat_friend_requests
for each row execute function public.guard_chat_friend_request_update();

create or replace function public.send_chat_friend_request(p_target_user_id uuid)
returns table (
  id uuid,
  requester_id uuid,
  addressee_id uuid,
  status text,
  created_at timestamptz,
  responded_at timestamptz
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_low uuid;
  v_high uuid;
  v_request public.chat_friend_requests%rowtype;
begin
  if v_uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if p_target_user_id is null or p_target_user_id = v_uid then
    raise exception 'Invalid recipient' using errcode = '22023';
  end if;
  v_low := least(v_uid, p_target_user_id);
  v_high := greatest(v_uid, p_target_user_id);

  insert into public.chat_friend_requests as existing
    (requester_id, addressee_id, pair_low, pair_high, status, created_at, responded_at)
  values (v_uid, p_target_user_id, v_low, v_high, 'pending', now(), null)
  on conflict (pair_low, pair_high) do update
    set requester_id = excluded.requester_id,
        addressee_id = excluded.addressee_id,
        status = 'pending',
        created_at = now(),
        responded_at = null
    where existing.status = 'rejected'
      and v_uid in (existing.requester_id, existing.addressee_id)
  returning existing.* into v_request;

  if not found then
    select r.* into v_request
    from public.chat_friend_requests r
    where r.pair_low = v_low and r.pair_high = v_high;
  end if;

  return query select v_request.id, v_request.requester_id, v_request.addressee_id,
    v_request.status, v_request.created_at, v_request.responded_at;
end;
$$;

create or replace function public.search_chat_profile(p_username text)
returns table (id uuid, username text, avatar_id smallint)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if p_username is null or p_username !~ '^[a-z0-9_]{3,20}$' then
    return;
  end if;
  return query
    select p.id, p.username, p.avatar_id
    from public.chat_profiles p
    where p.username = p_username
      and p.id <> (select auth.uid())
    limit 1;
end;
$$;

create or replace function public.get_chat_profiles(p_user_ids uuid[])
returns table (id uuid, username text, avatar_id smallint)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
begin
  if v_uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if coalesce(array_length(p_user_ids, 1), 0) > 100 then
    raise exception 'Too many profile IDs' using errcode = '22023';
  end if;
  return query
    select p.id, p.username, p.avatar_id
    from public.chat_profiles p
    where p.id = any(coalesce(p_user_ids, '{}'::uuid[]))
      and (
        exists (
          select 1 from public.chat_conversations c
          where (c.user_one = v_uid and c.user_two = p.id)
             or (c.user_two = v_uid and c.user_one = p.id)
        )
        or exists (
          select 1 from public.chat_friend_requests r
          where (r.requester_id = v_uid and r.addressee_id = p.id)
             or (r.addressee_id = v_uid and r.requester_id = p.id)
        )
      );
end;
$$;

revoke all on function public.send_chat_friend_request(uuid) from public, anon;
revoke all on function public.search_chat_profile(text) from public, anon;
revoke all on function public.get_chat_profiles(uuid[]) from public, anon;
grant execute on function public.send_chat_friend_request(uuid) to authenticated;
grant execute on function public.search_chat_profile(text) to authenticated;
grant execute on function public.get_chat_profiles(uuid[]) to authenticated;

-- Profiles contain only the public handle and avatar; direct reads are owner-only.
drop policy if exists "chat profiles visible to signed-in users" on public.chat_profiles;
drop policy if exists "users read their own chat profile" on public.chat_profiles;
create policy "users read their own chat profile"
on public.chat_profiles for select to authenticated
using ((select auth.uid()) = id);

-- A conversation can only be created for an accepted friend pair.
drop policy if exists "participants create direct conversations" on public.chat_conversations;
create policy "accepted friends create direct conversations"
on public.chat_conversations for insert to authenticated
with check (
  ((select auth.uid()) = user_one or (select auth.uid()) = user_two)
  and user_one < user_two
  and exists (
    select 1 from public.chat_friend_requests r
    where r.pair_low = chat_conversations.user_one
      and r.pair_high = chat_conversations.user_two
      and r.status = 'accepted'
  )
);

-- An old conversation remains readable, but messages can only be sent while the pair is accepted.
drop policy if exists "participants send their own messages" on public.chat_messages;
create policy "accepted conversation participants send their own messages"
on public.chat_messages for insert to authenticated
with check (
  sender_id = (select auth.uid())
  and exists (
    select 1 from public.chat_conversations c
    join public.chat_friend_requests r
      on r.pair_low = c.user_one and r.pair_high = c.user_two
    where c.id = chat_messages.conversation_id
      and (c.user_one = (select auth.uid()) or c.user_two = (select auth.uid()))
      and r.status = 'accepted'
  )
);
