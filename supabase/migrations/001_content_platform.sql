-- APTUS content platform schema for Supabase/Postgres
-- Run this migration from the Supabase SQL editor or CLI.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text not null default 'member' check (role in ('member', 'admin', 'manager')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('product', 'news', 'project')),
  slug text not null,
  locale text not null default 'en' check (locale in ('en', 'fa', 'tr')),
  status text not null default 'draft' check (status in ('draft', 'published')),
  template_key text not null default 'showcase' check (template_key in ('showcase', 'editorial', 'technical', 'case-study', 'gallery')),
  title text not null,
  abstract text not null default '',
  body text not null default '',
  cover_image text,
  category text,
  published_at timestamptz,
  highlights jsonb not null default '[]'::jsonb,
  specs jsonb not null default '{}'::jsonb,
  cta jsonb not null default '{}'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(type, slug, locale)
);

create table if not exists public.content_media (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.content_items(id) on delete cascade,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  url text not null,
  caption text,
  alt text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists content_items_type_status_idx
  on public.content_items(type, status, published_at desc);
create index if not exists content_items_slug_idx
  on public.content_items(slug);
create index if not exists content_media_content_order_idx
  on public.content_media(content_id, sort_order);

create table if not exists public.analytics_daily (
  day date not null,
  path text not null default '/',
  views bigint not null default 0,
  primary key(day, path)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists set_content_items_updated_at on public.content_items;
create trigger set_content_items_updated_at
before update on public.content_items
for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', new.email), 'member')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_content_editor()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'manager')
  );
$$;

grant execute on function public.is_content_editor() to authenticated;

create or replace function public.increment_page_view(view_day date, view_path text)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.analytics_daily(day, path, views)
  values(view_day, coalesce(nullif(view_path, ''), '/'), 1)
  on conflict(day, path)
  do update set views = public.analytics_daily.views + 1;
end;
$$;

grant execute on function public.increment_page_view(date, text) to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.content_items enable row level security;
alter table public.content_media enable row level security;
alter table public.analytics_daily enable row level security;

-- Profiles: users see themselves; content editors can inspect/manage all profiles.
drop policy if exists "profiles_self_read" on public.profiles;
create policy "profiles_self_read" on public.profiles
for select to authenticated
using (id = auth.uid() or public.is_content_editor());

drop policy if exists "profiles_editor_update" on public.profiles;
create policy "profiles_editor_update" on public.profiles
for update to authenticated
using (public.is_content_editor())
with check (public.is_content_editor());

-- Published content is public. Editors can read drafts and perform all mutations.
drop policy if exists "content_public_read" on public.content_items;
create policy "content_public_read" on public.content_items
for select to anon, authenticated
using (status = 'published' or public.is_content_editor());

drop policy if exists "content_editor_insert" on public.content_items;
create policy "content_editor_insert" on public.content_items
for insert to authenticated
with check (public.is_content_editor());

drop policy if exists "content_editor_update" on public.content_items;
create policy "content_editor_update" on public.content_items
for update to authenticated
using (public.is_content_editor())
with check (public.is_content_editor());

drop policy if exists "content_editor_delete" on public.content_items;
create policy "content_editor_delete" on public.content_items
for delete to authenticated
using (public.is_content_editor());

-- Media follows the visibility of its parent content item.
drop policy if exists "content_media_public_read" on public.content_media;
create policy "content_media_public_read" on public.content_media
for select to anon, authenticated
using (
  exists (
    select 1 from public.content_items item
    where item.id = content_id
      and (item.status = 'published' or public.is_content_editor())
  )
);

drop policy if exists "content_media_editor_insert" on public.content_media;
create policy "content_media_editor_insert" on public.content_media
for insert to authenticated
with check (public.is_content_editor());

drop policy if exists "content_media_editor_update" on public.content_media;
create policy "content_media_editor_update" on public.content_media
for update to authenticated
using (public.is_content_editor())
with check (public.is_content_editor());

drop policy if exists "content_media_editor_delete" on public.content_media;
create policy "content_media_editor_delete" on public.content_media
for delete to authenticated
using (public.is_content_editor());

-- Analytics writes go through increment_page_view(); only editors can read totals.
drop policy if exists "analytics_editor_read" on public.analytics_daily;
create policy "analytics_editor_read" on public.analytics_daily
for select to authenticated
using (public.is_content_editor());

-- Public content media bucket. Upload/delete remains editor-only through RLS.
insert into storage.buckets (id, name, public)
values ('content-media', 'content-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "content_media_storage_public_read" on storage.objects;
create policy "content_media_storage_public_read" on storage.objects
for select to public
using (bucket_id = 'content-media');

drop policy if exists "content_media_storage_editor_insert" on storage.objects;
create policy "content_media_storage_editor_insert" on storage.objects
for insert to authenticated
with check (bucket_id = 'content-media' and public.is_content_editor());

drop policy if exists "content_media_storage_editor_update" on storage.objects;
create policy "content_media_storage_editor_update" on storage.objects
for update to authenticated
using (bucket_id = 'content-media' and public.is_content_editor())
with check (bucket_id = 'content-media' and public.is_content_editor());

drop policy if exists "content_media_storage_editor_delete" on storage.objects;
create policy "content_media_storage_editor_delete" on storage.objects
for delete to authenticated
using (bucket_id = 'content-media' and public.is_content_editor());
