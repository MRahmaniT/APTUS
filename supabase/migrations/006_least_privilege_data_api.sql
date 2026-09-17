revoke all on table public.profiles from anon, authenticated;
grant select, update on table public.profiles to authenticated;

revoke all on table public.content_items from anon, authenticated;
grant select on table public.content_items to anon;
grant select, insert, update, delete on table public.content_items to authenticated;

revoke all on table public.content_media from anon, authenticated;
grant select on table public.content_media to anon;
grant select, insert, update, delete on table public.content_media to authenticated;

revoke all on table public.site_settings from anon, authenticated;
grant select on table public.site_settings to anon;
grant select, insert, update on table public.site_settings to authenticated;

revoke all on table public.analytics_daily from anon, authenticated;
grant select on table public.analytics_daily to authenticated;

revoke all on function public.increment_page_view(date, text) from public;
grant execute on function public.increment_page_view(date, text) to anon, authenticated;
