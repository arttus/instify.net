'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, MessageSquare, Search, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const automations: Array<{
  icon: LucideIcon;
  title: string;
  name: string;
  description: string;
}> = [
  {
    icon: FileText,
    title: 'Document Automation',
    name: 'AutoDraft',
    description: 'Transforms contracts, briefs, and pleadings automatically',
  },
  {
    icon: MessageSquare,
    title: 'Client Communication',
    name: 'ClientConnect',
    description: 'Manages intake, updates, and scheduling seamlessly',
  },
  {
    icon: Search,
    title: 'Legal Research Assistant',
    name: 'ResearchPro',
    description: 'Finds precedents and analyzes case law instantly',
  },
  {
    icon: Settings,
    title: 'Practice Management',
    name: 'WorkflowIQ',
    description: 'Automates tracking, billing, and deadlines',
  },
];

export function AutomationSuite() {
  return (
    <section id="solutions" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="heading-xl mb-4">
            24/7 AI Automation Workforce
          </h2>
          <p className="body-lg text-muted-foreground max-w-3xl mx-auto">
            Meet your intelligent automation team—available 24/7, never missing a deadline, 
            and trained specifically for legal workflows
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {automations.map((automation, index) => (
            <motion.div
              key={automation.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full card-lift border-2 hover:border-primary/50 transition-all">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg gradient-purple flex items-center justify-center mb-4">
                    <automation.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="heading-md mb-2">{automation.title}</h3>
                  <p className="text-sm font-semibold text-primary mb-2">{automation.name}</p>
                  <p className="body-base text-muted-foreground mb-4">
                    {automation.description}
                  </p>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <Play className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <a href="#" className="text-sm font-medium text-primary hover:underline mt-4 inline-block">
                    Learn More →
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Play({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}