'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Calendar, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { trackPhoneCall, trackConsultationRequest, trackDemoRequest } from '@/components/analytics';

export function CTASection() {
  const handlePhoneClick = () => {
    trackPhoneCall('cta');
  };

  const handleDemoClick = () => {
    trackDemoRequest('cta_button');
  };

  const handleConsultationClick = () => {
    trackConsultationRequest();
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-cyan-purple opacity-10 -z-10" />
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0, 217, 255, 0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="site-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="glass-strong border-cyan/30 glow-cyan">
            <CardContent className="p-8 md:p-12 text-center">
              <motion.div
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Phone className="w-16 h-16 mx-auto mb-6 text-cyan" />
                <h2 className="heading-xl mb-4 text-foreground">
                  Ready to Transform Your Practice?
                </h2>
                <p className="body-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
                  Call now to experience our AI receptionist live. No sales pitch—just a real demonstration 
                  of how we can capture every call and transform your practice.
                </p>

                {/* Phone Number */}
                <a
                  href="tel:8449634740"
                  onClick={handlePhoneClick}
                  className="inline-block phone-number gradient-text-cyan glow-text-cyan hover:scale-105 transition-transform mb-8 animate-pulse-glow px-6 py-3 rounded-2xl bg-cyan/5 border border-cyan/20"
                >
                  (844) 963-4740
                </a>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-center gap-3 text-foreground/90">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-cyan" />
                    <span>Try our AI receptionist live—call now</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-foreground/90">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-cyan" />
                    <span>Get custom ROI projection for your firm</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-foreground/90">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-cyan" />
                    <span>No obligation, no pressure</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="gradient-cyan-purple hover:opacity-90 transition-opacity text-lg px-8 py-6 group glow-cyan"
                    asChild
                  >
                    <a href="tel:8449634740" onClick={handleDemoClick}>
                      <Phone className="mr-2 w-5 h-5" />
                      Call for Live Demo
                    </a>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-cyan/30 hover:border-cyan hover:bg-cyan/10 transition-all text-lg px-8 py-6"
                    asChild
                  >
                    <Link href="/contact" onClick={handleConsultationClick}>
                      <Calendar className="mr-2 w-5 h-5" />
                      Schedule Consultation
                    </Link>
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mt-6">
                  Join law firms across North America who have transformed their practices with ODEUO AI
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}