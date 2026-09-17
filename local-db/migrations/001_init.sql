-- APTUS self-hosted PostgreSQL schema.
-- Applied by server/src/migrate.js and suitable for PostgreSQL 18+.

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  password_hash text not null,
  name text not null,
  role text not null default 'member' check (role in ('member', 'admin', 'manager')),
  phone text,
  photo_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists users_email_lower_uidx on users (lower(email));

create table if not exists sessions (
  token_hash text primary key,
  user_id uuid not null references users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists sessions_user_id_idx on sessions(user_id);
create index if not exists sessions_expires_at_idx on sessions(expires_at);

create table if not exists content_items (
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
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(type, slug, locale)
);

create table if not exists content_media (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references content_items(id) on delete cascade,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  url text not null,
  caption text,
  alt text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists content_items_type_status_idx
  on content_items(type, locale, status, published_at desc);
create index if not exists content_items_slug_idx
  on content_items(type, slug, locale);
create index if not exists content_items_created_by_idx
  on content_items(created_by);
create index if not exists content_media_content_order_idx
  on content_media(content_id, sort_order);

create table if not exists analytics_daily (
  day date not null,
  path text not null default '/',
  views bigint not null default 0,
  primary key(day, path)
);

create table if not exists site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on users;
create trigger users_set_updated_at
before update on users
for each row execute function set_updated_at();

drop trigger if exists content_items_set_updated_at on content_items;
create trigger content_items_set_updated_at
before update on content_items
for each row execute function set_updated_at();

drop trigger if exists site_settings_set_updated_at on site_settings;
create trigger site_settings_set_updated_at
before update on site_settings
for each row execute function set_updated_at();
