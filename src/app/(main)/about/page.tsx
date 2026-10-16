import { AboutHero } from "@/components/section/about/AboutHero";
import { AboutJourney } from "@/components/section/about/AboutJourney";
import { AboutFeatures } from "@/components/section/about/AboutFeatures";
import { AboutStats } from "@/components/section/about/AboutStats";
import { AboutTeam } from "@/components/section/about/AboutTeam";
import { AboutCTA } from "@/components/section/about/AboutCTA";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AboutHero />
      <AboutJourney />
      <AboutFeatures />
      <AboutStats />
      <AboutTeam />
      <AboutCTA />
    </div>
  );
}