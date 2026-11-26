create table if not exists sodo_private.trakt_media_metadata (
  media_type text not null check (media_type in ('movie','show')),
  trakt_id bigint not null,
  imdb_id text,
  tmdb_id bigint,
  title text not null,
  year integer,
  overview text,
  tagline text,
  poster_url text,
  rating numeric(4,2),
  genres text[] not null default '{}',
  runtime integer,
  certification text,
  status text,
  trailer text,
  homepage text,
  cast_members jsonb not null default '[]'::jsonb,
  metadata_updated_at timestamptz not null default now(),
  primary key (media_type, trakt_id)
);
alter table sodo_private.trakt_media_metadata enable row level security;
alter table sodo_private.trakt_media_metadata force row level security;
revoke all on sodo_private.trakt_media_metadata from anon, authenticated;
grant select, insert, update, delete on sodo_private.trakt_media_metadata to service_role;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('sodo-posters', 'sodo-posters', true, 5242880, array['image/webp','image/jpeg','image/png'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
