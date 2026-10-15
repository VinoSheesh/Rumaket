"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/lib/firebase/auth-context";
import { RequireAuth } from "@/lib/firebase/guard";
import { DashboardHeader } from "@/components/dashboard/Header";

function DashboardChrome({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "profiles", user.uid)).then((snap) => {
      setFullName((snap.data()?.full_name as string | undefined) ?? null);
    });
  }, [user]);

  const userName = fullName ?? user?.email?.split("@")[0] ?? "User";
  const userEmail = user?.email ?? "";

  return (
    <div className="min-h-screen bg-slate-50/50">
      <DashboardHeader userName={userName} userEmail={userEmail} />
      <main className="mx-auto w-full max-w-6xl px-6 pt-28 pb-12">
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <DashboardChrome>{children}</DashboardChrome>
    </RequireAuth>
  );
}
