create policy "deny anon and authenticated access to Trakt metadata"
on public.trakt_media_metadata
for all
to anon, authenticated
using (false)
with check (false);
