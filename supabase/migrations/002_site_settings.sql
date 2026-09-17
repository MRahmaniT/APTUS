create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute procedure public.set_updated_at();

drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read" on public.site_settings
for select to anon, authenticated
using (true);

drop policy if exists "site_settings_editor_insert" on public.site_settings;
create policy "site_settings_editor_insert" on public.site_settings
for insert to authenticated
with check (public.is_content_editor());

drop policy if exists "site_settings_editor_update" on public.site_settings;
create policy "site_settings_editor_update" on public.site_settings
for update to authenticated
using (public.is_content_editor())
with check (public.is_content_editor());

insert into public.site_settings(key, value)
values ('home', '{}'::jsonb)
on conflict (key) do nothing;
