"use client";

import { motion } from "framer-motion";
import { Phone, Headphones, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CallDemoBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary via-secondary to-primary relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
            <Headphones className="h-4 w-4" />
            Live Demo Available Now
          </div>

          <h2 className="heading-xl mb-4">
            Hear Our AI Receptionist in Action
          </h2>
          
          <p className="body-lg mb-8 text-white/90 max-w-2xl mx-auto">
            Call now to experience a live demonstration of how our AI handles legal inquiries, 
            qualifies leads, and books consultations—just like a professional receptionist.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-xl shadow-black/20 group text-lg px-8"
            >
              <a href="tel:+18449634740" className="flex items-center">
                <Phone className="mr-3 h-6 w-6 animate-pulse" />
                <div className="flex flex-col items-start">
                  <span className="text-xs opacity-80">Call Now</span>
                  <span className="font-bold">(844) 963-4740</span>
                </div>
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Available 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>Instant Demo</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="h-4 w-4" />
              <span>No Obligation</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}