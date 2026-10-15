import { Header } from "@/components/section/home/Header";
import { Footer } from "@/components/section/home/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const isLoggedIn = !!data.user;

  return (
      <body className="min-h-full flex flex-col bg-white text-[#0b0b14]">
        <Header isLoggedIn={isLoggedIn} />
        {children}
        <Footer />
      </body>
  );
}
