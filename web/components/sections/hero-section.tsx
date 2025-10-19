'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTheme } from '@/components/theme-provider';
import { useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { trackPhoneCall, trackConsultationRequest, trackDemoRequest } from '@/components/analytics';

const Hyperspeed = dynamic(() => import('@/components/hyperspeed-main'), { ssr: false });

export function HeroSection() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(true);

  // Directly use theme value
  const isDark = theme === 'dark';

  const handlePhoneClick = () => {
    trackPhoneCall('hero');
  };

  const handleDemoClick = () => {
    trackDemoRequest('hero_button');
  };

  const handleConsultationClick = () => {
    trackConsultationRequest();
  };

  useEffect(() => {
    // Force remount of Hyperspeed component when theme changes
    setMounted(false);
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, [theme]);

  // Memoize colors based on isDark
  const effectColors = useMemo(() => {
    return isDark ? {
      roadColor: 0x000000,
      islandColor: 0x000000,
      background: 0x000000,
      shoulderLines: 0x222222,
      brokenLines: 0x333333,
      leftCars: [0xcc4499, 0x7744aa, 0xaa3388],
      rightCars: [0x0088cc, 0x0066aa, 0x004488],
      sticks: 0x0088cc,
    } : {
      roadColor: 0xfafafa,
      islandColor: 0xf5f5f5,
      background: 0xffffff,
      shoulderLines: 0xd0d0d0,
      brokenLines: 0xc0c0c0,
      leftCars: [0xff88cc, 0xaa77dd, 0xdd66bb],
      rightCars: [0x44bbff, 0x3399ee, 0x2277cc],
      sticks: 0x44bbff,
    };
  }, [isDark]);

  // Custom gentle distortion with reduced amplitude
  const gentleDistortion = {
    uniforms: {
      uFreq: { value: new THREE.Vector4(2, 4, 4, 0.5) },
      uAmp: { value: new THREE.Vector4(8, 2, 3, 3) }
    },
    getDistortion: `
      uniform vec4 uFreq;
      uniform vec4 uAmp;
      float nsin(float val){
        return sin(val) * 0.5 + 0.5;
      }
      #define PI 3.14159265358979
      float getDistortionX(float progress){
        return (
          cos(PI * progress * uFreq.r + uTime) * uAmp.r +
          pow(cos(PI * progress * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2. ) * uAmp.g
        );
      }
      float getDistortionY(float progress){
        return (
          -nsin(PI * progress * uFreq.b + uTime) * uAmp.b +
          -pow(nsin(PI * progress * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.) * uAmp.a
        );
      }
      vec3 getDistortion(float progress){
        return vec3(
          getDistortionX(progress) - getDistortionX(0.0125),
          getDistortionY(progress) - getDistortionY(0.0125),
          0.
        );
      }
    `
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute bottom-0 left-0 right-0 h-[100%] -z-20" style={{ backgroundColor: isDark ? '#000000' : '#ffffff' }}>
        {mounted && (
          <Hyperspeed
            key={`hyperspeed-${isDark ? 'dark' : 'light'}-${JSON.stringify(effectColors)}`}
            effectOptions={{
            onSpeedUp: () => {},
            onSlowDown: () => {},
            distortion: gentleDistortion,
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 4,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 8,
            carLightsFade: 0.4,
            totalSideLightSticks: 20,
            lightPairsPerRoadWay: 40,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [0.5, 1],
            movingCloserSpeed: [-1, -2],
            carLightsLength: [400 * 0.03, 400 * 0.2],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.8, 0.8],
            carFloorSeparation: [0, 5],
            colors: effectColors
          }}
        />
        )}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80 -z-10" />
      
      <div className="site-container py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-muted/50 border border-cyan/20">
              <Sparkles className="w-4 h-4 mr-2 text-cyan" />
              24/7 AI-Powered Legal Reception
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="heading-hero mb-6 text-foreground"
          >
            Never Lose Another Client to a{' '}
            <span className="gradient-text glow-text-cyan">Missed Call</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="body-lg text-muted-foreground mb-8 max-w-3xl mx-auto"
          >
            Experience our AI receptionist live. Call now for an instant demo and see how we capture 100% of calls, 
            reduce staff overwhelm, and provide professional 24/7 coverage for your law practice.
          </motion.p>

          {/* Phone Number CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-10"
          >
            <a
              href="tel:8449634740"
              onClick={handlePhoneClick}
              className="inline-block phone-number gradient-text-cyan glow-text-cyan hover:scale-105 transition-transform animate-pulse-glow px-6 py-3 rounded-2xl bg-cyan/5 border border-cyan/20"
            >
              (844) 963-4740
            </a>
            <p className="text-sm text-muted-foreground mt-2">
              Call now to try our AI receptionist • Available 24/7
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 text-sm">
              <CheckCircle2 className="w-5 h-5 text-cyan" />
              <span className="font-semibold text-foreground">100% Call Capture</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <Clock className="w-5 h-5 text-cyan" />
              <span className="font-semibold text-foreground">24/7 Coverage</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <CheckCircle2 className="w-5 h-5 text-cyan" />
              <span className="font-semibold text-foreground">7-14 Day Setup</span>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" className="text-lg px-8 py-6 gradient-cyan-purple hover:opacity-90 transition-opacity group glow-cyan" asChild>
              <a href="tel:8449634740" onClick={handleDemoClick}>
                <Phone className="mr-2 w-5 h-5" />
                Call for Live Demo
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-cyan/30 hover:border-cyan hover:bg-cyan/10 transition-all" asChild>
              <Link href="/contact" onClick={handleConsultationClick}>
                Schedule Consultation
              </Link>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
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
        transition={{ duration: 0.5, delay: 0.7 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-cyan/30 rounded-full flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-cyan rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}