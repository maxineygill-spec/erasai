-- Run in Supabase SQL Editor to create the Living Ledger table.

create table if not exists living_ledger_entries (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id),
  protocol_type text not null,
  responses     jsonb not null,
  completed_at  timestamptz,
  created_at    timestamptz default now()
);

alter table living_ledger_entries enable row level security;

create policy "Users read own entries"
  on living_ledger_entries for select
  using (auth.uid() = user_id);
