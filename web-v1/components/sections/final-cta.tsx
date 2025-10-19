"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export function FinalCTA() {
  const benefits = [
    "No credit card required",
    "No obligation consultation",
    "Typical ROI: 5:1 within 6 months",
  ];

  return (
    <section id="audit" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1518839283416-0cc546d12a97?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHxuZXVyYWwlMjBuZXR3b3JrJTIwdGVjaG5vbG9neSUyMHBhdHRlcm4lMjBkaWdpdGFsJTIwYWJzdHJhY3QlMjBBSSUyMHZpc3VhbGl6YXRpb258ZW58MHwwfHxwdXJwbGV8MTc2MDczNzMxNXww&ixlib=rb-4.1.0&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="heading-lg mb-6">
            Start Your Practice Transformation Today
          </h2>
          <p className="body-lg mb-8 text-primary-foreground/90">
            Get a free 45-minute practice audit. We'll analyze your current call
            handling, identify opportunities, and show you exactly how AI can
            transform your practice.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="inline-block bg-card/10 backdrop-blur-sm border-primary-foreground/20">
              <CardContent className="p-8">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 h-auto mb-6"
                  >
                    Schedule Your Free Audit
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>

                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                      className="flex items-center justify-center text-sm text-primary-foreground/80"
                    >
                      <CheckCircle className="h-4 w-4 text-automation-cyan mr-2" />
                      {benefit}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-8 text-sm text-primary-foreground/60"
          >
            Join law firms across North America who are transforming their
            practices with AI automation
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}