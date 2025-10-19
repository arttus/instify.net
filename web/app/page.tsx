import { Header } from '@/components/sections/header';
import { HeroSection } from '@/components/sections/hero-section';
import { ProblemSection } from '@/components/sections/problem-section';
import { SolutionSection } from '@/components/sections/solution-section';
import { TransformationSection } from '@/components/sections/transformation-section';
import { CTASection } from '@/components/sections/cta-section';
import { Footer } from '@/components/sections/footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <TransformationSection />
      <CTASection />
      <Footer />
    </main>
  );
}