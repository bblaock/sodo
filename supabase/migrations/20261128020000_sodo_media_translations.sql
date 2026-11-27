alter table public.trakt_media_metadata
  add column if not exists translations jsonb not null default '{}'::jsonb;

comment on column public.trakt_media_metadata.translations is
  'Localized movie/show metadata keyed by site language (ar/en/ru), sourced from Trakt translations.';
