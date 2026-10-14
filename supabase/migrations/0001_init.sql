-- Caretaker & Patient Room — initial schema
-- Run this once in Supabase Dashboard → SQL Editor → New query → Run.

-- ========== ENUMS ==========
create type room_role as enum ('owner', 'caretaker');
create type schedule_category as enum ('medication', 'meal', 'hygiene', 'vitals', 'therapy');
create type time_slot as enum ('morning', 'afternoon', 'evening', 'custom');
create type schedule_status as enum ('pending', 'completed', 'skipped');
create type attendance_status as enum ('on_duty', 'completed');
create type note_category as enum ('health_condition', 'behavior_change', 'vitals_result', 'shift_handover');

-- ========== TABLES ==========
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);

create table public.patient_rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  patient_name text not null,
  invite_code text not null unique,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.room_members (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.patient_rooms (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role room_role not null,
  created_at timestamptz not null default now(),
  unique (room_id, user_id)
);

create table public.schedules (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.patient_rooms (id) on delete cascade,
  category schedule_category not null,
  time_slot time_slot not null,
  specific_time time,
  title text not null,
  description text,
  scheduled_date date not null default current_date,
  status schedule_status not null default 'pending',
  skip_reason text,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.attendances (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.patient_rooms (id) on delete cascade,
  caretaker_id uuid not null references public.profiles (id) on delete cascade,
  check_in_at timestamptz not null default now(),
  check_out_at timestamptz,
  status attendance_status not null default 'on_duty'
);

create unique index one_active_shift_per_caretaker
  on public.attendances (room_id, caretaker_id)
  where status = 'on_duty';

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.patient_rooms (id) on delete cascade,
  caretaker_id uuid not null references public.profiles (id) on delete cascade,
  category note_category not null,
  content text not null,
  photo_url text,
  created_at timestamptz not null default now()
);

create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

-- ========== HELPER FUNCTIONS ==========
create function public.is_room_member(target_room_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.room_members
    where room_id = target_room_id and user_id = auth.uid()
  );
$$;

create function public.is_room_owner(target_room_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.room_members
    where room_id = target_room_id and user_id = auth.uid() and role = 'owner'
  );
$$;

-- Auto-create a profile row when a new auth user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-add the creator of a room as its owner member.
create function public.handle_new_room()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.room_members (room_id, user_id, role)
  values (new.id, new.created_by, 'owner');
  return new;
end;
$$;

create trigger on_room_created
  after insert on public.patient_rooms
  for each row execute procedure public.handle_new_room();

-- Lets a caretaker join a room by invite code without needing broad read access.
create function public.join_room_by_code(code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_room public.patient_rooms;
begin
  select * into target_room from public.patient_rooms where invite_code = upper(code);

  if target_room.id is null then
    raise exception 'Kode undangan tidak ditemukan';
  end if;

  insert into public.room_members (room_id, user_id, role)
  values (target_room.id, auth.uid(), 'caretaker')
  on conflict (room_id, user_id) do nothing;

  return target_room.id;
end;
$$;

grant execute on function public.join_room_by_code(text) to authenticated;

-- ========== ROW LEVEL SECURITY ==========
alter table public.profiles enable row level security;
alter table public.patient_rooms enable row level security;
alter table public.room_members enable row level security;
alter table public.schedules enable row level security;
alter table public.attendances enable row level security;
alter table public.notes enable row level security;
alter table public.push_subscriptions enable row level security;

-- profiles
create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_roommates_select" on public.profiles
  for select using (
    exists (
      select 1 from public.room_members rm1
      join public.room_members rm2 on rm1.room_id = rm2.room_id
      where rm1.user_id = auth.uid() and rm2.user_id = profiles.id
    )
  );

create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id);

-- patient_rooms
create policy "rooms_member_select" on public.patient_rooms
  for select using (public.is_room_member(id));

create policy "rooms_insert_self" on public.patient_rooms
  for insert with check (created_by = auth.uid());

create policy "rooms_owner_update" on public.patient_rooms
  for update using (public.is_room_owner(id));

create policy "rooms_owner_delete" on public.patient_rooms
  for delete using (public.is_room_owner(id));

-- room_members
create policy "room_members_select" on public.room_members
  for select using (public.is_room_member(room_id));

create policy "room_members_owner_insert" on public.room_members
  for insert with check (public.is_room_owner(room_id));

create policy "room_members_delete" on public.room_members
  for delete using (public.is_room_owner(room_id) or user_id = auth.uid());

-- schedules
create policy "schedules_member_select" on public.schedules
  for select using (public.is_room_member(room_id));

create policy "schedules_member_insert" on public.schedules
  for insert with check (public.is_room_member(room_id) and created_by = auth.uid());

create policy "schedules_member_update" on public.schedules
  for update using (public.is_room_member(room_id));

create policy "schedules_delete" on public.schedules
  for delete using (public.is_room_owner(room_id) or created_by = auth.uid());

-- attendances
create policy "attendances_member_select" on public.attendances
  for select using (public.is_room_member(room_id));

create policy "attendances_self_insert" on public.attendances
  for insert with check (public.is_room_member(room_id) and caretaker_id = auth.uid());

create policy "attendances_self_update" on public.attendances
  for update using (caretaker_id = auth.uid());

-- notes
create policy "notes_member_select" on public.notes
  for select using (public.is_room_member(room_id));

create policy "notes_self_insert" on public.notes
  for insert with check (public.is_room_member(room_id) and caretaker_id = auth.uid());

create policy "notes_self_update" on public.notes
  for update using (caretaker_id = auth.uid());

create policy "notes_delete" on public.notes
  for delete using (public.is_room_owner(room_id) or caretaker_id = auth.uid());

-- push_subscriptions
create policy "push_subscriptions_self" on public.push_subscriptions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ========== GRANTS ==========
grant usage on schema public to authenticated, anon;
grant select, insert, update, delete on
  public.profiles,
  public.patient_rooms,
  public.room_members,
  public.schedules,
  public.attendances,
  public.notes,
  public.push_subscriptions
to authenticated;

-- ========== REALTIME ==========
alter publication supabase_realtime add table public.attendances;
alter publication supabase_realtime add table public.schedules;
alter publication supabase_realtime add table public.notes;

-- ========== STORAGE (note photos) ==========
insert into storage.buckets (id, name, public)
values ('note-photos', 'note-photos', false)
on conflict (id) do nothing;

create policy "note_photos_room_select" on storage.objects
  for select using (
    bucket_id = 'note-photos'
    and public.is_room_member((storage.foldername(name))[1]::uuid)
  );

create policy "note_photos_room_insert" on storage.objects
  for insert with check (
    bucket_id = 'note-photos'
    and public.is_room_member((storage.foldername(name))[1]::uuid)
  );
