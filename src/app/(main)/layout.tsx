"use client";

import { Header } from "@/components/section/home/Header";
import { Footer } from "@/components/section/home/Footer";
import { useAuth } from "@/lib/firebase/auth-context";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user } = useAuth();

  return (
    <body className="min-h-full flex flex-col bg-white text-[#0b0b14]">
      <Header isLoggedIn={!!user} />
      {children}
      <Footer />
    </body>
  );
}
