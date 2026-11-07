alter table content_items drop constraint if exists content_items_type_check;
alter table content_items add constraint content_items_type_check check(type in ('product','news','project','article'));

create table auth_identities (
  channel text not null check(channel in ('email','sms')),
  target text not null,
  user_id uuid not null references users(id) on delete cascade,
  verified_at timestamptz not null default now(),
  primary key(channel,target)
);
create table otp_challenges (
  id uuid primary key,
  channel text not null check(channel in ('email','sms')),
  target text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
create index otp_target_created_idx on otp_challenges(channel,target,created_at);
