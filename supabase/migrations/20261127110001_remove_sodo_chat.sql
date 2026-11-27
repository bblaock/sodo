-- Remove the SODO Chat feature and its chat-only database objects.
-- Shared Supabase Auth users are intentionally preserved.
alter publication supabase_realtime drop table public.chat_messages;
alter publication supabase_realtime drop table public.chat_friend_requests;

drop table if exists public.chat_messages cascade;
drop table if exists public.chat_conversations cascade;
drop table if exists public.chat_friend_requests cascade;
drop table if exists public.chat_profiles cascade;

drop function if exists public.guard_chat_friend_request_update();
drop function if exists public.send_chat_friend_request(uuid);
drop function if exists public.search_chat_profile(text);
drop function if exists public.get_chat_profiles(uuid[]);
