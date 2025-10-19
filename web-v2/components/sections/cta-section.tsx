'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Calendar, CheckCircle2 } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent -z-10" />
      <div className="absolute inset-0 opacity-10 -z-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="glass text-white border-white/20">
            <CardContent className="p-8 md:p-12 text-center">
              <motion.div
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Calendar className="w-16 h-16 mx-auto mb-6 text-white" />
                <h2 className="heading-xl mb-4 text-white">
                  Ready to Transform Your Practice?
                </h2>
                <p className="body-lg mb-8 text-white/90 max-w-2xl mx-auto">
                  Get a free 45-minute practice transformation audit. We'll analyze your current operations, 
                  identify opportunities, and show you exactly how AI can capture more clients and free up your time.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-center gap-3 text-white/90">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Comprehensive practice analysis</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-white/90">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Custom ROI projection for your firm</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-white/90">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>No obligation, no pressure</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 group"
                  >
                    Schedule Your Free Audit
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                  >
                    See Demo First
                  </Button>
                </div>

                <p className="text-sm text-white/70 mt-6">
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