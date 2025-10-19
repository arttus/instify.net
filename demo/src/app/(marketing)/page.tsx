import { HeroSection } from "@/components/sections/hero-section";
import { TransformationOverview } from "@/components/sections/transformation-overview";
import { SocialProof } from "@/components/sections/social-proof";
import { ROICalculator } from "@/components/interactive/roi-calculator";
import { PracticeAuditCTA } from "@/components/sections/practice-audit-cta";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <TransformationOverview />
      <SocialProof />
      <ROICalculator />
      <PracticeAuditCTA />
    </main>
  );
}