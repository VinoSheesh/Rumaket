-- Phase: Firebase migration — Supabase is now used ONLY for Storage (note
-- photos). Firestore + Firebase Auth replaced the Postgres tables + Supabase
-- Auth, so storage policies can no longer depend on auth.uid()/room_members.
-- Run this once in Supabase Dashboard → SQL Editor → New query → Run.

-- Make sure the bucket exists and is public (public reads need no policy —
-- paths are random UUIDs, so this is an acceptable trade-off for a
-- free-tier, Firebase-Auth-fronted setup).
insert into storage.buckets (id, name, public)
values ('note-photos', 'note-photos', true)
on conflict (id) do update set public = true;

-- Drop the old Postgres-RLS-based policies from 0001_init.sql, if they ran —
-- they reference `is_room_member()`, which no longer has any data to check
-- now that room membership lives in Firestore.
drop policy if exists "note_photos_room_select" on storage.objects;
drop policy if exists "note_photos_room_insert" on storage.objects;

-- The app calls Storage directly with the public anon key (no Supabase Auth
-- session exists anymore), so uploads are gated only by knowing the anon
-- key — already public in the client bundle — rather than per-user RLS.
create policy "note_photos_anon_insert" on storage.objects
  for insert
  to anon
  with check (bucket_id = 'note-photos');
