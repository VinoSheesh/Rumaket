import { Header } from "@/components/section/home/Header";
import { Hero } from "@/components/section/home/Hero";
import { Roles } from "@/components/section/home/Roles";
import { Features } from "@/components/section/home/Features";
import { HowItWorks } from "@/components/section/home/HowItWorks";
import { CTA } from "@/components/section/home/CTA";
import { Footer } from "@/components/section/home/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      <Roles />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
