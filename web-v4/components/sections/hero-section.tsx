'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 gradient-intelligence">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-intelligence-blue via-intelligence-blue/95 to-intelligence-blue/90" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="heading-hero mb-6 text-white"
          >
            Navigate to the Future of Legal Practice
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="body-lg text-white/80 mb-10 max-w-2xl mx-auto"
          >
            AI automation that transforms hours of manual work into minutes. 
            Built specifically for legal firms.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button size="lg" className="text-lg px-8 py-6 gradient-purple text-white hover:opacity-90 transition-opacity">
              Book a Demo →
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Dashboard Preview Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div className="aspect-video bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 backdrop-blur-sm flex items-center justify-center">
              <div className="text-white/60 text-center">
                <Play className="w-16 h-16 mx-auto mb-4" />
                <p className="text-sm">Dashboard Preview</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}