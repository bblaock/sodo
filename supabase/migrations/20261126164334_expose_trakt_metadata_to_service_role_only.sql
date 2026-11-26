alter table sodo_private.trakt_media_metadata set schema public;
alter table public.trakt_media_metadata enable row level security;
alter table public.trakt_media_metadata force row level security;
revoke all on public.trakt_media_metadata from anon, authenticated;
grant select, insert, update, delete on public.trakt_media_metadata to service_role;
