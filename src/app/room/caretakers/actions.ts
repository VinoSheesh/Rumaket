import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export async function removeCaretaker(roomId: string, memberId: string) {
  const memberToDeleteSnap = await getDoc(
    doc(db, "patient_rooms", roomId, "members", memberId)
  );

  if (memberToDeleteSnap.data()?.role === "owner") {
    const ownersSnap = await getDocs(
      query(
        collection(db, "patient_rooms", roomId, "members"),
        where("role", "==", "owner")
      )
    );
    const remainingOwners = ownersSnap.docs.filter((d) => d.id !== memberId).length;
    if (remainingOwners === 0) {
      return {
        ok: false as const,
        error: "Tidak dapat menghapus owner terakhir",
      };
    }
  }

  await deleteDoc(doc(db, "patient_rooms", roomId, "members", memberId));
  return { ok: true as const };
}
