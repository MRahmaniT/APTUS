create index if not exists content_items_created_by_idx on public.content_items(created_by);

alter policy "profiles_self_read" on public.profiles
using (id = (select auth.uid()) or private.is_content_editor());
