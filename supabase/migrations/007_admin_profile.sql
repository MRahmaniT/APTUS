alter table public.profiles
  add column if not exists phone text,
  add column if not exists photo_url text,
  add column if not exists bio text;
