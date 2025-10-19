import { HeroSection } from "@/components/sections/hero-section";
import { TrustBar } from "@/components/sections/trust-bar";
import { ProblemSection } from "@/components/sections/problem-section";
import { SolutionSection } from "@/components/sections/solution-section";
import { HowItWorks } from "@/components/sections/how-it-works";
import { TransformationJourney } from "@/components/sections/transformation-journey";
import { ROICalculator } from "@/components/sections/roi-calculator";
import { FAQSection } from "@/components/sections/faq-section";
import { FinalCTA } from "@/components/sections/final-cta";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <TrustBar />
        <ProblemSection />
        <SolutionSection />
        <HowItWorks />
        <TransformationJourney />
        <ROICalculator />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}