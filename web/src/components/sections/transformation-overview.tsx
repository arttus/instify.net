"use client";

import { motion } from "framer-motion";
import { Phone, MessageSquare, Cog, TrendingUp, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const phases = [
  {
    phase: "Phase 1",
    title: "AI Voice Receptionist",
    subtitle: "The Foundation",
    description: "Professional 24/7 phone answering that captures every call, qualifies leads, and books consultations automatically.",
    icon: Phone,
    benefits: [
      "100% call capture rate",
      "35-60% increase in consultations",
      "$30,000+ annual savings",
      "Deploy in 7-14 days"
    ],
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-500/10 to-blue-600/10",
  },
  {
    phase: "Phase 2",
    title: "Multi-Channel Lead Capture",
    subtitle: "Expand Your Reach",
    description: "Instant follow-up across text, email, social media, and website chat. Capture leads from every channel.",
    icon: MessageSquare,
    benefits: [
      "40-50% more lead capture",
      "90%+ response within 2 minutes",
      "Social media DM automation",
      "Website chat integration"
    ],
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-500/10 to-purple-600/10",
  },
  {
    phase: "Phase 3",
    title: "Practice Operations",
    subtitle: "Operational Excellence",
    description: "Automate routine operations from intake to billing. Free attorneys for high-value legal work.",
    icon: Cog,
    benefits: [
      "10-15 hours freed weekly",
      "60% reduction in admin time",
      "Automated client intake",
      "Document automation"
    ],
    color: "from-amber-500 to-amber-600",
    bgColor: "from-amber-500/10 to-amber-600/10",
  },
  {
    phase: "Phase 4",
    title: "Strategic Growth",
    subtitle: "Scale & Optimize",
    description: "Advanced systems for sustainable growth. Data-driven insights and custom AI solutions for your unique needs.",
    icon: TrendingUp,
    benefits: [
      "25-50% annual growth",
      "Predictable case flow",
      "Practice analytics",
      "Scalable operations"
    ],
    color: "from-green-500 to-green-600",
    bgColor: "from-green-500/10 to-green-600/10",
  },
];

export function TransformationOverview() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm mb-4">
            Transformation Journey
          </div>
          <h2 className="heading-xl mb-6">
            Your Path to Practice Excellence
          </h2>
          <p className="body-lg text-muted-foreground">
            We don't just sell software—we partner with you through a proven 4-phase transformation. 
            Start with quick wins, expand systematically based on ROI.
          </p>
        </motion.div>

        {/* Phases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-8 rounded-2xl h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                {/* Phase Badge & Icon */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 bg-gradient-to-br ${phase.bgColor} rounded-xl`}>
                    <phase.icon className={`h-8 w-8 bg-gradient-to-br ${phase.color} bg-clip-text text-transparent`} />
                  </div>
                  <div className={`px-3 py-1 bg-gradient-to-r ${phase.color} text-white rounded-full text-xs font-bold`}>
                    {phase.phase}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="heading-md mb-2">{phase.title}</h3>
                    <p className="text-sm font-semibold text-primary mb-3">{phase.subtitle}</p>
                    <p className="body-md text-muted-foreground">{phase.description}</p>
                  </div>

                  {/* Benefits */}
                  <ul className="space-y-2">
                    {phase.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-sm">
                        <Check className="h-5 w-5 text-success-green flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hover Arrow */}
                <div className="mt-6 flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                  Learn more
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="glass-card p-8 rounded-2xl max-w-2xl mx-auto">
            <h3 className="heading-md mb-4">Ready to Start Your Transformation?</h3>
            <p className="body-md text-muted-foreground mb-6">
              Call us now for a live demo or schedule a free 45-minute practice audit. We'll show you exactly how AI automation can transform your firm.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-success-green to-success-green/80 hover:from-success-green/90 hover:to-success-green/70 text-white shadow-lg"
              >
                <a href="tel:+18449634740">
                  <Phone className="mr-2 h-5 w-5" />
                  Call: (844) 963-4740
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="glass-card border-2"
              >
                <Link href="#audit">
                  Get Your Free Practice Audit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}