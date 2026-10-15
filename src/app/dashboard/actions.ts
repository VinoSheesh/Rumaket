import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { generateInviteCode } from "@/lib/invite-code";

export async function createRoom(userId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const patientName = String(formData.get("patient_name") ?? "").trim();

  if (!name || !patientName) {
    return {
      ok: false as const,
      error: "Nama room dan nama lansia wajib diisi.",
    };
  }

  const roomRef = doc(collection(db, "patient_rooms"));
  let code = "";

  // Retry if the generated invite code already exists.
  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = generateInviteCode(8);
    const codeSnap = await getDoc(doc(db, "invite_codes", candidate));
    if (!codeSnap.exists()) {
      code = candidate;
      break;
    }
  }

  if (!code) {
    return {
      ok: false as const,
      error: "Gagal membuat room. Silakan coba lagi.",
    };
  }

  try {
    // Step 1: create the room first so the owner-membership rule's
    // `get(patient_rooms/{roomId}).created_by` check sees a committed doc
    // (Firestore rules read pre-batch state for writes in the same batch).
    await setDoc(roomRef, {
      name,
      patient_name: patientName,
      invite_code: code,
      created_by: userId,
      created_at: new Date().toISOString(),
    });

    // Step 2: invite-code lookup + owner membership together.
    const batch = writeBatch(db);
    batch.set(doc(db, "invite_codes", code), { room_id: roomRef.id });
    batch.set(doc(db, "patient_rooms", roomRef.id, "members", userId), {
      room_id: roomRef.id,
      user_id: userId,
      role: "owner",
      created_at: new Date().toISOString(),
    });
    await batch.commit();
  } catch (err) {
    // Compensate: remove the orphaned room if step 2 failed.
    await deleteDoc(roomRef).catch(() => {});
    console.error("Failed to create room:", err);
    return {
      ok: false as const,
      error: "Gagal membuat room. Periksa koneksi atau izin database.",
    };
  }

  return { ok: true as const, roomId: roomRef.id };
}
