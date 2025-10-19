import { HeroSection } from "@/components/sections/hero-section";
import { TransformationOverview } from "@/components/sections/transformation-overview";
import { SocialProof } from "@/components/sections/social-proof";
import { CallDemoBanner } from "@/components/sections/call-demo-banner";
import { ROICalculator } from "@/components/interactive/roi-calculator";
import { PracticeAuditCTA } from "@/components/sections/practice-audit-cta";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StickyCallButton } from "@/components/ui/sticky-call-button";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <TransformationOverview />
        <CallDemoBanner />
        <SocialProof />
        <ROICalculator />
        <PracticeAuditCTA />
      </main>
      <Footer />
      <StickyCallButton />
    </>
  );
}