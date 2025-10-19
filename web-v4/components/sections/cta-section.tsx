'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-24 gradient-purple relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="heading-xl mb-6 text-white">
            Ready to Transform Your Practice?
          </h2>
          <p className="body-lg text-white/90 mb-10">
            Join leading law firms using AI automation to work smarter, 
            scale faster, and serve clients better.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90">
              Book Your Demo →
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white/10">
              Calculate Your ROI
            </Button>
          </div>

          <p className="text-sm text-white/70">
            No credit card required • 14-day implementation • Full support included
          </p>
        </motion.div>
      </div>
    </section>
  );
}