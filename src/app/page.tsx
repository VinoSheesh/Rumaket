import { Hero } from "@/components/section/home/Hero";
import { Roles } from "@/components/section/home/Roles";
import { Features } from "@/components/section/home/Features";
import { HowItWorks } from "@/components/section/home/HowItWorks";
import { CTA } from "@/components/section/home/CTA";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Hero />
      <Roles />
      <Features />
      <HowItWorks />
      <CTA />
    </div>
  );
}
