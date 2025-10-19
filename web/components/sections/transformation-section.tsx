'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, MessageSquare, Briefcase, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const phases: Array<{
  phase: string;
  title: string;
  icon: LucideIcon;
  description: string;
  results: string[];
  color: string;
}> = [
  {
    phase: 'Phase 1',
    title: 'Communication Foundation',
    icon: Phone,
    description: 'AI Voice Receptionist for 24/7 coverage',
    results: ['100% call capture', '35-60% increase in bookings', '7-14 day implementation'],
    color: 'from-cyan to-cyan/80',
  },
  {
    phase: 'Phase 2',
    title: 'Lead Capture & Nurturing',
    icon: MessageSquare,
    description: 'Multi-channel automation across all touchpoints',
    results: ['40-50% increase in leads', '90%+ response within 2 min', 'Higher conversion rates'],
    color: 'from-purple to-purple/80',
  },
  {
    phase: 'Phase 3',
    title: 'Practice Operations',
    icon: Briefcase,
    description: 'Systematic automation of routine operations',
    results: ['10-15 hours freed weekly', '60% admin time reduction', 'Improved client satisfaction'],
    color: 'from-pink to-pink/80',
  },
  {
    phase: 'Phase 4',
    title: 'Strategic Growth',
    icon: TrendingUp,
    description: 'Advanced systems for practice optimization',
    results: ['25-50% annual growth', 'Predictable case flow', 'Scalable operations'],
    color: 'from-cyan to-purple',
  },
];

export function TransformationSection() {
  return (
    <section id="transformation" className="py-24 bg-gradient-to-b from-background/50 to-background">
      <div className="site-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4 bg-purple/10 border-purple/20 text-purple">
            Phased Transformation Approach
          </Badge>
          <h2 className="heading-xl mb-4 text-foreground">
            Your <span className="gradient-text">Transformation Journey</span>
          </h2>
          <p className="body-lg text-muted-foreground max-w-3xl mx-auto">
            We don&apos;t just sell tools—we become your long-term transformation partner.
            Start with high-impact AI reception, then expand systematically based on ROI and your firm&apos;s readiness.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-card/50 border-border hover:border-cyan/30 hover:shadow-xl hover:shadow-cyan/10 transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
                  <div className={`h-2 bg-gradient-to-r ${phase.color}`} />
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${phase.color} text-white`}>
                        <phase.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2 border-cyan/30">
                          {phase.phase}
                        </Badge>
                        <h3 className="heading-md mb-2 text-foreground">{phase.title}</h3>
                        <p className="body-base text-muted-foreground mb-4">
                          {phase.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-cyan">Expected Results:</p>
                      <ul className="space-y-1">
                        {phase.results.map((result, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan" />
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Key Differentiators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16"
          >
            <Card className="glass border-cyan/20">
              <CardContent className="p-8">
                <h3 className="heading-lg mb-6 text-center text-foreground">Why Our Approach Works</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text-cyan mb-2">5:1</div>
                    <p className="text-sm font-semibold mb-1 text-foreground">Minimum ROI Target</p>
                    <p className="text-xs text-muted-foreground">Every automation justified by measurable value</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text-cyan mb-2">90%+</div>
                    <p className="text-sm font-semibold mb-1 text-foreground">Client Retention</p>
                    <p className="text-xs text-muted-foreground">Long-term partnerships, not one-time projects</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text-cyan mb-2">7-14</div>
                    <p className="text-sm font-semibold mb-1 text-foreground">Days to Deploy</p>
                    <p className="text-xs text-muted-foreground">Quick wins with Phase 1 implementation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}