"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Moon, PhoneOff, Plane } from "lucide-react";
import { motion } from "framer-motion";

export function ProblemSection() {
  const problems = [
    {
      icon: Moon,
      title: "After-Hours Loss",
      description:
        "Missing 30-50% of potential clients from evening and weekend calls when your office is closed.",
      stat: "30-50%",
      statLabel: "missed calls",
    },
    {
      icon: PhoneOff,
      title: "Overflow Gaps",
      description:
        "Calls go to voicemail when your receptionist is busy with another client or in a meeting.",
      stat: "1 call",
      statLabel: "at a time",
    },
    {
      icon: Plane,
      title: "Vacation Blackouts",
      description:
        "No reliable coverage during PTO without hiring expensive temporary staff.",
      stat: "$4K-8K",
      statLabel: "temp costs/year",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg text-primary mb-4">
            Your receptionist can't be everywhere at once
          </h2>
          <p className="body-lg text-secondary max-w-3xl mx-auto">
            Even the best receptionists face an impossible reality: they can
            only handle one call at a time, can't work 24/7, and deserve time
            off.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                        <problem.icon className="h-6 w-6 text-destructive" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="heading-sm text-primary mb-2">
                        {problem.title}
                      </h3>
                      <p className="body-base text-secondary mb-4">
                        {problem.description}
                      </p>
                      <div className="pt-3 border-t border-border">
                        <div className="text-2xl font-bold text-destructive mb-1">
                          {problem.stat}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {problem.statLabel}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}