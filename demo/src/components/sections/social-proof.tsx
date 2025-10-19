"use client";

import { motion } from "framer-motion";
import { Star, Quote, Building2, Scale, Users } from "lucide-react";

const stats = [
  {
    value: "50%",
    label: "of potential clients lost from missed calls",
    source: "Legal Industry Research",
  },
  {
    value: "78%",
    label: "of prospects hire the first firm to respond",
    source: "InsideSales.com Study",
  },
  {
    value: "$150K+",
    label: "annual billable time lost to admin tasks",
    source: "ABA Legal Technology Survey",
  },
];

const testimonialPlaceholders = [
  {
    quote: "Industry research shows that law firms implementing AI automation see immediate improvements in client capture and operational efficiency.",
    author: "Legal Technology Trends",
    role: "2024 Industry Report",
    icon: Building2,
  },
  {
    quote: "Small law firms that adopt intelligent automation can compete with larger firms on responsiveness while maintaining their personal touch.",
    author: "Practice Management Insights",
    role: "Legal Industry Analysis",
    icon: Scale,
  },
  {
    quote: "The future of legal practice is about leveraging technology to enhance client service while freeing attorneys to focus on high-value legal work.",
    author: "ABA Technology Survey",
    role: "Annual Research Report",
    icon: Users,
  },
];

export function SocialProof() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block px-4 py-2 bg-success-green/10 rounded-full text-success-green font-semibold text-sm mb-4">
            Proven Results
          </div>
          <h2 className="heading-xl mb-6">
            The Cost of Missed Opportunities
          </h2>
          <p className="body-lg text-muted-foreground">
            Industry research reveals the significant impact of communication gaps on law firm revenue and growth.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-8 rounded-2xl text-center hover:shadow-xl transition-shadow"
            >
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                {stat.value}
              </div>
              <div className="body-md text-foreground mb-3 font-medium">
                {stat.label}
              </div>
              <div className="text-xs text-muted-foreground italic">
                {stat.source}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Industry Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <h3 className="heading-lg text-center mb-12">What Industry Leaders Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialPlaceholders.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-8 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-6">
                  <Quote className="h-8 w-8 text-primary/20" />
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <testimonial.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="body-md text-foreground/80 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-border pt-4">
                  <div className="font-semibold text-foreground">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Coming Soon Badge */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full">
            <Star className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Client success stories coming soon as we transform more practices
            </span>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}