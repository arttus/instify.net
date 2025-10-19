'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, FileText, Mic, Play, Image as ImageIcon, GitBranch } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const features: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track automation ROI, time saved, and efficiency metrics in real-time',
  },
  {
    icon: FileText,
    title: 'Automated Intake Summaries',
    description: 'AI generates detailed case intake summaries automatically',
  },
  {
    icon: Mic,
    title: 'Real-Time Transcription',
    description: 'Follow conversations as they happen with live transcription',
  },
  {
    icon: Play,
    title: 'Call Playback & Review',
    description: 'Replay and review past client interactions for quality assurance',
  },
  {
    icon: ImageIcon,
    title: 'Smart Document Collection',
    description: 'AI automatically requests and organizes required case documents',
  },
  {
    icon: GitBranch,
    title: 'Intelligent Call Routing',
    description: 'Handle new leads, existing clients, and third parties with smart routing',
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="heading-xl mb-4">
            One AI Platform for Complete Practice Automation
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full card-lift">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg gradient-cyan flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="heading-md mb-2">{feature.title}</h3>
                  <p className="body-base text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  <div className="aspect-video bg-muted rounded-lg" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}