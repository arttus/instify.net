'use client';

import { motion } from 'framer-motion';
import { Compass, Wrench, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const steps: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: Compass,
    title: 'Discovery Call',
    description: 'Our journey begins with understanding your firm\'s unique workflows and automation needs. We map out how ODUEO can deliver value fast.',
  },
  {
    icon: Wrench,
    title: 'Configuration & Training',
    description: 'We configure automation workflows specific to your practice, integrate with your existing systems, and train your team.',
  },
  {
    icon: Rocket,
    title: 'Go Live & Optimize',
    description: 'Launch your AI automation with full support. We monitor performance, gather feedback, and continuously optimize for maximum ROI.',
  },
];

export function ProcessSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="heading-xl mb-4">
            Simple Three-Step Process to Get Started
          </h2>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-border" style={{ width: 'calc(100% - 8rem)', left: '4rem' }} />
            
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full gradient-purple flex items-center justify-center relative z-10 bg-background">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="heading-md mb-3">{step.title}</h3>
                <p className="body-base text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}