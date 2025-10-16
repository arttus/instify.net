"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Calendar } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex"
          >
            <div className="glass-card px-4 py-2 rounded-full text-sm font-medium text-primary">
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Trusted by Leading Law Firms
              </span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="heading-hero bg-gradient-to-r from-trust-navy via-primary to-secondary bg-clip-text text-transparent dark:from-slate-100 dark:via-blue-400 dark:to-blue-300"
          >
            Transform Your Practice with AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="heading-md text-trust-navy/80 dark:text-slate-300 max-w-3xl mx-auto"
          >
            Never Lose Another Client
          </motion.p>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="body-lg text-muted-foreground max-w-2xl mx-auto"
          >
            24/7 AI voice receptionist captures every call, qualifies leads, and books consultations automatically. 
            Transform your law firm with intelligent automation that increases revenue and frees your time.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-stretch pt-6"
          >
            <Button
              asChild
              className="bg-gradient-to-r from-success-green to-success-green/80 hover:from-success-green/90 hover:to-success-green/70 text-white shadow-2xl shadow-success-green/30 group h-24 px-10 rounded-2xl hover:scale-105 transition-transform w-full sm:w-96"
            >
              <a href="tel:+18449634740" className="flex items-center justify-center gap-5">
                <Phone size={80} className="animate-pulse flex-shrink-0" style={{ width: '80px', height: '80px', minWidth: '80px', minHeight: '80px' }} />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-normal opacity-90">Call Now for Demo</span>
                  <span className="text-xl font-bold">(844) 963-4740</span>
                </div>
              </a>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-2xl shadow-primary/30 group h-24 px-10 rounded-2xl hover:scale-105 transition-transform w-full sm:w-96"
            >
              <Link href="#audit" className="flex items-center justify-center gap-5">
                <Calendar size={80} className="flex-shrink-0" style={{ width: '80px', height: '80px', minWidth: '80px', minHeight: '80px' }} />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-normal opacity-90">Schedule Your</span>
                  <span className="text-xl font-bold">Free Practice Audit</span>
                </div>
              </Link>
            </Button>
          </motion.div>

          {/* Call to Action Message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-base text-muted-foreground font-medium"
          >
            <Phone className="inline h-5 w-5 mr-2" />
            Call now for a live demo of our AI receptionist in action
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto"
          >
            {[
              { value: "100%", label: "Call Capture Rate", icon: Phone },
              { value: "35-60%", label: "More Consultations", icon: Calendar },
              { value: "$30K+", label: "Annual Savings", icon: ArrowRight },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="glass-card p-6 rounded-2xl hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-sm">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}