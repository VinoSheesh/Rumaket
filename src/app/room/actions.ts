import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export async function checkIn(roomId: string, userId: string) {
  const existing = await getDocs(
    query(
      collectionGroup(db, "attendances"),
      where("caretaker_id", "==", userId),
      where("status", "==", "on_duty")
    )
  );

  if (!existing.empty) {
    return { ok: false as const, error: "Anda masih bertugas di room lain" };
  }

  const ref = doc(collection(db, "patient_rooms", roomId, "attendances"));
  await setDoc(ref, {
    room_id: roomId,
    caretaker_id: userId,
    check_in_at: new Date().toISOString(),
    check_out_at: null,
    status: "on_duty",
  });

  return { ok: true as const };
}

export async function checkOut(attendanceId: string, roomId: string) {
  await updateDoc(doc(db, "patient_rooms", roomId, "attendances", attendanceId), {
    check_out_at: new Date().toISOString(),
    status: "completed",
  });

  return { ok: true as const };
}
