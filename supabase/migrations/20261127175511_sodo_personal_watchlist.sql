create table public.sodo_user_library (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  media_key text not null check (char_length(media_key) between 1 and 240),
  media_type text not null check (media_type in ('movie', 'series')),
  title text not null check (char_length(title) between 1 and 300),
  release_year integer check (release_year is null or release_year between 1888 and 2200),
  status text not null default 'watchlist'
    check (status in ('watchlist', 'watching', 'watched', 'upcoming', 'dropped')),
  imdb_id text,
  tmdb_id bigint,
  trakt_id bigint,
  imdb_rating numeric(3,1) check (imdb_rating is null or imdb_rating between 0 and 10),
  poster_url text,
  detail_url text,
  watched_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sodo_user_library_user_media_key_unique unique (user_id, media_key)
);

create index sodo_user_library_user_status_updated_idx
  on public.sodo_user_library (user_id, status, updated_at desc);

alter table public.sodo_user_library enable row level security;
alter table public.sodo_user_library force row level security;

revoke all on table public.sodo_user_library from anon, authenticated;
grant select, insert, update, delete on table public.sodo_user_library to authenticated;

create policy "Users can read their own personal library"
  on public.sodo_user_library for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add to their own personal library"
  on public.sodo_user_library for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own personal library"
  on public.sodo_user_library for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can remove from their own personal library"
  on public.sodo_user_library for delete to authenticated
  using ((select auth.uid()) = user_id);

comment on table public.sodo_user_library is
  'Private per-user SODO watch statuses; every row is visible only to its owner.';
