"use client";

import { Badge } from "@/components/ui/badge";
import { Shield, Award, Clock } from "lucide-react";
import { motion } from "framer-motion";

export function TrustBar() {
  const indicators = [
    {
      icon: Shield,
      text: "SOC 2 & GDPR Compliant",
    },
    {
      icon: Award,
      text: "Trusted by Law Firms",
    },
    {
      icon: Clock,
      text: "24/7 Coverage",
    },
  ];

  return (
    <section className="py-8 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {indicators.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex items-center space-x-2"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <item.icon className="h-4 w-4 text-accent" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {item.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}