import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    if (!credential.user.emailVerified) {
      await firebaseSignOut(auth);
      return {
        ok: false as const,
        error: "Email belum diverifikasi. Cek inbox Anda.",
      };
    }

    return { ok: true as const, redirectTo: "/dashboard" };
  } catch {
    return {
      ok: false as const,
      error: "Email atau password salah.",
    };
  }
}

export async function signUp(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (password.length < 6) {
    return { ok: false as const, error: "Password minimal 6 karakter" };
  }

  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(credential.user, { displayName: fullName });

    await setDoc(doc(db, "profiles", credential.user.uid), {
      full_name: fullName,
      phone: null,
      created_at: new Date().toISOString(),
    });

    await sendEmailVerification(credential.user);
    await firebaseSignOut(auth);

    return {
      ok: true as const,
      redirectTo: `/check-email?email=${encodeURIComponent(email)}`,
    };
  } catch (err) {
    const message =
      err instanceof Error && err.message.includes("email-already-in-use")
        ? "Email sudah terdaftar."
        : "Gagal mendaftar. Silakan coba lagi.";
    return { ok: false as const, error: message };
  }
}

export async function signInWithGoogle() {
  try {
    const credential = await signInWithPopup(auth, new GoogleAuthProvider());

    await setDoc(
      doc(db, "profiles", credential.user.uid),
      {
        full_name: credential.user.displayName ?? null,
        phone: null,
        created_at: new Date().toISOString(),
      },
      { merge: true }
    );

    return { ok: true as const, redirectTo: "/dashboard" };
  } catch {
    return { ok: false as const, error: "Gagal masuk dengan Google." };
  }
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export async function joinRoomByCode(userId: string, formData: FormData) {
  const code = String(formData.get("code") ?? "").trim().toUpperCase();

  if (!/^[A-HJ-NP-Z2-9]{8}$/.test(code)) {
    return {
      ok: false as const,
      error: "Kode undangan tidak valid. Periksa kembali 8 karakter kode.",
    };
  }

  const codeSnap = await getDoc(doc(db, "invite_codes", code));
  if (!codeSnap.exists()) {
    return { ok: false as const, error: "Kode undangan tidak ditemukan." };
  }

  const roomId = codeSnap.data().room_id as string;
  const memberRef = doc(db, "patient_rooms", roomId, "members", userId);

  const existing = await getDoc(memberRef);
  if (existing.exists()) {
    return { ok: true as const, roomId };
  }

  try {
    await setDoc(memberRef, {
      room_id: roomId,
      user_id: userId,
      role: "caretaker",
      joined_via_code: code,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to join room:", err);
    return { ok: false as const, error: "Gagal bergabung ke room. Silakan coba lagi." };
  }

  return { ok: true as const, roomId };
}
