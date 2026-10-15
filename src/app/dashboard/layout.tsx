import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard/Header";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", data.user.id)
    .single();

  const userName = profile?.full_name ?? data.user.email?.split("@")[0] ?? "User";
  const userEmail = data.user.email ?? "";

  return (
    <div className="min-h-screen bg-slate-50/50">
      <DashboardHeader userName={userName} userEmail={userEmail} />
      <main className="mx-auto w-full max-w-6xl px-6 pt-28 pb-12">
        {children}
      </main>
    </div>
  );
}