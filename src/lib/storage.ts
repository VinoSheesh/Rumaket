const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Photo uploads for the Notes feature live in Supabase Storage (free tier,
// no card required) while Auth/Firestore stay on Firebase — see
// supabase/migrations/0002_storage_only.sql for why.
export async function uploadNotePhoto(path: string, file: File) {
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/note-photos/${path}`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    }
  );

  if (!res.ok) {
    throw new Error(`Upload gagal: ${res.status}`);
  }
}

export function getNotePhotoUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/note-photos/${path}`;
}
