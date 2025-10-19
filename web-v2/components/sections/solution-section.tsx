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
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 -z-10" />
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">
            Phase 1: Communication Foundation
          </Badge>
          <h2 className="heading-xl mb-4">
            AI Voice Receptionist: Your <span className="gradient-text">24/7 Backup</span>
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
          <Card className="max-w-5xl mx-auto glass-dark text-white overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="heading-lg mb-4">Team Augmentation, Not Replacement</h3>
                  <p className="body-base mb-6 text-white/80">
                    Your receptionist handles calls during business hours. The AI seamlessly covers everything else—
                    after hours, overflow, breaks, and vacations. Together, you capture 100% of opportunities.
                  </p>
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                        <span className="text-white/90">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary to-accent/50 flex items-center justify-center">
                    <Phone className="w-32 h-32 text-white/20" />
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
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="heading-md mb-2">{feature.title}</h3>
                  <p className="body-base text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
            <CardContent className="p-8">
              <h3 className="heading-lg mb-6 text-center">How It Works With Your Team</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Business Hours</h4>
                      <p className="text-sm text-muted-foreground">
                        AI answers when receptionist is busy, then asks: "Would you like me to transfer you to our receptionist?"
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Warm Transfers</h4>
                      <p className="text-sm text-muted-foreground">
                        AI provides context: "I have John Smith asking about estate planning..."
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">After Hours</h4>
                      <p className="text-sm text-muted-foreground">
                        AI provides full coverage with option to reach attorney for emergencies
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Client Preference</h4>
                      <p className="text-sm text-muted-foreground">
                        If caller requests a human, AI immediately transfers or offers callback
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                      5
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Complex Situations</h4>
                      <p className="text-sm text-muted-foreground">
                        AI recognizes nuanced questions and offers to connect with attorney or receptionist
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                      6
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Seamless Experience</h4>
                      <p className="text-sm text-muted-foreground">
                        Clients get help either way—AI or human, whichever is most appropriate
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12"
        >
          <Button size="lg" className="text-lg px-8 py-6 group">
            Schedule Your Free Practice Audit
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            See how AI can transform your practice in a 45-minute consultation
          </p>
        </motion.div>
      </div>
    </section>
  );
}