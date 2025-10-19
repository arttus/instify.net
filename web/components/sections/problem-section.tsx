'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { PhoneOff, Clock, Users, TrendingDown, AlertCircle, DollarSign } from 'lucide-react';

const problems = [
  {
    icon: PhoneOff,
    title: 'After-Hours Abandonment',
    description: 'No coverage during evenings, weekends, and holidays when prospective clients are most likely to reach out.',
    stat: '30-50% of calls',
  },
  {
    icon: Clock,
    title: 'Coverage Gaps',
    description: 'Missed calls during lunch breaks, meetings, court appearances, or when your receptionist is assisting other clients.',
    stat: 'Every day',
  },
  {
    icon: Users,
    title: 'Receptionist Overwhelm',
    description: 'Peak call times leave clients waiting or going to voicemail. One person can only handle one call at a time.',
    stat: '1 call at a time',
  },
  {
    icon: TrendingDown,
    title: 'Slow Lead Response',
    description: 'Prospects contact 3-5 firms. The first to respond wins 78% of the time.',
    stat: '78% win rate',
  },
  {
    icon: AlertCircle,
    title: 'Vacation Blackouts',
    description: 'No reliable coverage when your receptionist takes time off. Temp staff is expensive and inconsistent.',
    stat: '$4K-8K/year',
  },
  {
    icon: DollarSign,
    title: 'Lost Revenue',
    description: 'Each missed call represents $5K-$100K+ in potential lifetime client value.',
    stat: '$200K+ annually',
  },
];

export function ProblemSection() {
  return (
    <section id="problem" className="py-24 bg-gradient-to-b from-background to-background/50">
      <div className="site-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="heading-xl mb-4 text-foreground">
            Every Missed Call is a <span className="gradient-text">Lost Client</span>
          </h2>
          <p className="body-lg text-muted-foreground max-w-3xl mx-auto">
            Law firms lose up to 50% of potential clients from missed calls during after-hours, busy periods, and coverage gaps. 
            In the legal industry, a single missed call can represent $10,000-$100,000 in lifetime client value.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-card/50 border-border hover:border-cyan/30 hover:shadow-lg hover:shadow-cyan/10 transition-all duration-300 hover:-translate-y-1 group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-cyan/10 group-hover:bg-cyan/20 transition-colors">
                      <problem.icon className="w-6 h-6 text-cyan" />
                    </div>
                    <div className="flex-1">
                      <h3 className="heading-md mb-2 text-foreground">{problem.title}</h3>
                      <p className="body-base text-muted-foreground mb-3">
                        {problem.description}
                      </p>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-semibold border border-destructive/20">
                        {problem.stat}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Card className="max-w-4xl mx-auto glass border-destructive/20">
            <CardContent className="p-8">
              <h3 className="heading-lg mb-4 text-destructive">The Real Cost of Missed Calls</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-destructive mb-2">$200K+</div>
                  <p className="text-sm text-muted-foreground">Annual revenue loss from just 2 missed after-hours calls per week</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-destructive mb-2">$150K</div>
                  <p className="text-sm text-muted-foreground">Annual cost of peak hour overflow that exceeds receptionist capacity</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-destructive mb-2">5-10 hrs</div>
                  <p className="text-sm text-muted-foreground">Monthly personal time lost by attorneys answering calls after hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}