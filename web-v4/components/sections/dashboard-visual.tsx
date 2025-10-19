'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const features = [
  {
    title: '24/7 Automated Client Intake',
    description: 'AI handles initial consultations and gathers case details automatically',
  },
  {
    title: 'Smart Document Generation',
    description: 'Create contracts, briefs, and forms in minutes, not hours',
  },
  {
    title: 'Intelligent Workflow Management',
    description: 'Track deadlines, automate routine tasks, focus on billable work',
  },
  {
    title: 'Seamless Integration',
    description: 'Connects with your existing case management and practice systems',
  },
];

export function DashboardVisual() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="heading-xl mb-8">
              Transform Your Practice with Intelligent Automation
            </h2>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="heading-md mb-1">{feature.title}</h3>
                    <p className="body-base text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Dashboard Screenshot */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border-2 border-border shadow-2xl flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p className="text-sm">Dashboard Screenshot</p>
                  <p className="text-xs mt-2">Analytics & Automation Stats</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}