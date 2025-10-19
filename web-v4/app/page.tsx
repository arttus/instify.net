import { Header } from '@/components/sections/header';
import { HeroSection } from '@/components/sections/hero-section';
import { AutomationSuite } from '@/components/sections/automation-suite';
import { DashboardVisual } from '@/components/sections/dashboard-visual';
import { FeaturesGrid } from '@/components/sections/features-grid';
import { ProcessSection } from '@/components/sections/process-section';
import { StatsSection } from '@/components/sections/stats-section';
import { FAQSection } from '@/components/sections/faq-section';
import { CTASection } from '@/components/sections/cta-section';
import { Footer } from '@/components/sections/footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <AutomationSuite />
      <DashboardVisual />
      <FeaturesGrid />
      <ProcessSection />
      <StatsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}