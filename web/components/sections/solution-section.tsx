'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Clock, 
  Users, 
  Calendar, 
  MessageSquare, 
  Shield,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: 'After-Hours Coverage',
    description: 'Answers every call during evenings, weekends, and holidays with professional legal expertise.',
  },
  {
    icon: Users,
    title: 'Overflow Support',
    description: 'Handles calls when your receptionist is on another line or assisting clients in person.',
  },
  {
    icon: Phone,
    title: 'Smart Call Transfer',
    description: 'Can forward calls to your receptionist or attorneys during business hours when appropriate.',
  },
  {
    icon: Calendar,
    title: 'Calendar Integration',
    description: 'Books consultations directly into attorney schedules with intelligent availability management.',
  },
  {
    icon: MessageSquare,
    title: 'Natural Conversation',
    description: 'Professional dialogue trained on legal terminology that builds trust and maintains your brand.',
  },
  {
    icon: Shield,
    title: 'Legal Compliance',
    description: 'Trained on ethical obligations, never gives legal advice, and maintains proper boundaries.',
  },
];

const benefits = [
  '100% call capture rate',
  '35-60% increase in after-hours bookings',
  'Receptionist freed from interruptions',
  'Professional vacation coverage',
  'Peace of mind for attorneys',
  'Client choice respected',
];

export function SolutionSection() {
  return (
    <section id="solution" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-purple/5 -z-10" />
      
      <div className="site-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4 bg-cyan/10 border-cyan/20 text-cyan">
            AI Voice Receptionist
          </Badge>
          <h2 className="heading-xl mb-4 text-foreground">
            Your <span className="gradient-text">24/7 Backup</span> Solution
          </h2>
          <p className="body-lg text-muted-foreground max-w-3xl mx-auto">
            24/7 AI phone coverage that works alongside your existing receptionist team, ensuring zero missed calls 
            during after-hours, lunch breaks, busy periods, vacations, and overflow situations.
          </p>
        </motion.div>

        {/* Main Feature Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="max-w-5xl mx-auto glass border-cyan/20 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="heading-lg mb-4 text-foreground">Team Augmentation, Not Replacement</h3>
                  <p className="body-base mb-6 text-muted-foreground">
                    Your receptionist handles calls during business hours. The AI seamlessly covers everything else—
                    after hours, overflow, breaks, and vacations. Together, you capture 100% of opportunities.
                  </p>
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-cyan flex-shrink-0" />
                        <span className="text-foreground/90">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-2xl gradient-cyan-purple flex items-center justify-center relative overflow-hidden">
                    <Phone className="w-32 h-32 text-white/20 absolute" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                    <div className="relative z-10 text-center">
                      <a href="tel:8449634740" className="phone-number text-foreground glow-text-cyan block mb-2">
                        (844) 963-4740
                      </a>
                      <p className="text-foreground/80 text-sm">Call now to try it live</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-card/50 border-border hover:border-purple/30 hover:shadow-lg hover:shadow-purple/10 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-lg bg-purple/10 w-fit">
                        <feature.icon className="w-6 h-6 text-purple" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="heading-md mb-2 text-foreground">{feature.title}</h3>
                      <p className="body-base text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Button size="lg" className="text-lg px-8 py-6 gradient-cyan-purple hover:opacity-90 transition-opacity group glow-cyan">
            <Phone className="mr-2 w-5 h-5" />
            Call (844) 963-4740 for Live Demo
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Experience our AI receptionist in action • Available 24/7
          </p>
        </motion.div>
      </div>
    </section>
  );
}