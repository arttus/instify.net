'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Phone, Clock, CheckCircle2 } from 'lucide-react';
import { ThreeBackground } from '@/components/three-background';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ThreeBackground />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5 -z-10" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Phone className="w-4 h-4 mr-2" />
              24/7 AI-Powered Legal Reception
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="heading-hero mb-6 gradient-text"
          >
            Never Lose Another Client to a Missed Call
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="body-lg text-muted-foreground mb-8 max-w-3xl mx-auto"
          >
            Transform your law practice with AI automation that works alongside your team. 
            Capture 100% of calls, reduce staff overwhelm, and provide professional 24/7 coverage—starting with our flagship AI Voice Receptionist.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 text-sm">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-semibold">100% Call Capture</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-semibold">24/7 Coverage</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-semibold">7-14 Day Setup</span>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" className="text-lg px-8 py-6 group">
              Get Your Free Practice Audit
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              See AI Receptionist Demo
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-sm text-muted-foreground mt-8"
          >
            Trusted by law firms across North America • HIPAA-Ready • Bar Association Compliant
          </motion.p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-primary rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}