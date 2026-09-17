create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create or replace function private.is_content_editor()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'manager')
  );
$$;
revoke all on function private.is_content_editor() from public;
grant execute on function private.is_content_editor() to anon, authenticated;

alter function public.set_updated_at() set search_path = pg_catalog, pg_temp;
alter function public.handle_new_user() set search_path = public, pg_temp;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.is_content_editor() from public, anon, authenticated;

alter policy "profiles_self_read" on public.profiles using (id = auth.uid() or private.is_content_editor());
alter policy "profiles_editor_update" on public.profiles using (private.is_content_editor()) with check (private.is_content_editor());
alter policy "content_public_read" on public.content_items using (status = 'published' or private.is_content_editor());
alter policy "content_editor_insert" on public.content_items with check (private.is_content_editor());
alter policy "content_editor_update" on public.content_items using (private.is_content_editor()) with check (private.is_content_editor());
alter policy "content_editor_delete" on public.content_items using (private.is_content_editor());
alter policy "content_media_public_read" on public.content_media using (exists (select 1 from public.content_items item where item.id = content_id and (item.status = 'published' or private.is_content_editor())));
alter policy "content_media_editor_insert" on public.content_media with check (private.is_content_editor());
alter policy "content_media_editor_update" on public.content_media using (private.is_content_editor()) with check (private.is_content_editor());
alter policy "content_media_editor_delete" on public.content_media using (private.is_content_editor());
alter policy "analytics_editor_read" on public.analytics_daily using (private.is_content_editor());
alter policy "content_media_storage_editor_insert" on storage.objects with check (bucket_id = 'content-media' and private.is_content_editor());
alter policy "content_media_storage_editor_update" on storage.objects using (bucket_id = 'content-media' and private.is_content_editor()) with check (bucket_id = 'content-media' and private.is_content_editor());
alter policy "content_media_storage_editor_delete" on storage.objects using (bucket_id = 'content-media' and private.is_content_editor());
alter policy "site_settings_editor_insert" on public.site_settings with check (private.is_content_editor());
alter policy "site_settings_editor_update" on public.site_settings using (private.is_content_editor()) with check (private.is_content_editor());
