"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Brain, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function SolutionSection() {
  const features = [
    {
      icon: Clock,
      title: "24/7 Coverage",
      description:
        "Never miss after-hours opportunities. AI answers every call during evenings, weekends, and holidays.",
    },
    {
      icon: Users,
      title: "Smart Transfer",
      description:
        "Can transfer calls to your receptionist or attorneys during business hours with full context.",
    },
    {
      icon: Brain,
      title: "Legal Expertise",
      description:
        "Trained on legal terminology and intake processes. Understands your practice area.",
    },
    {
      icon: Zap,
      title: "Seamless Integration",
      description:
        "Works with your existing team and tools. Deployed in 7-14 days with minimal disruption.",
    },
  ];

  return (
    <section id="solution" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg text-primary mb-4">
            Intelligent backup that works alongside your team
          </h2>
          <p className="body-lg text-secondary max-w-3xl mx-auto">
            Our AI receptionist doesn't replace your team—it augments them.
            Your receptionist handles calls during business hours, and AI
            seamlessly covers everything else.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-5">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-automation-cyan/10 flex items-center justify-center">
                        <feature.icon className="h-5 w-5 text-automation-cyan" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="heading-sm text-primary mb-2">
                        {feature.title}
                      </h3>
                      <p className="body-base text-secondary">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Visual Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h4 className="font-semibold text-primary mb-2">
                    Your Receptionist
                  </h4>
                  <p className="text-sm text-secondary">
                    Handles calls during business hours
                  </p>
                </div>

                <div className="flex items-center">
                  <div className="text-4xl text-accent font-bold">+</div>
                </div>

                <div className="flex-1 text-center">
                  <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-10 w-10 text-accent" />
                  </div>
                  <h4 className="font-semibold text-primary mb-2">
                    AI Backup
                  </h4>
                  <p className="text-sm text-secondary">
                    Covers overflow & after-hours
                  </p>
                </div>

                <div className="flex items-center">
                  <div className="text-4xl text-automation-cyan font-bold">=</div>
                </div>

                <div className="flex-1 text-center">
                  <div className="w-20 h-20 rounded-full bg-automation-cyan/10 flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-10 w-10 text-automation-cyan" />
                  </div>
                  <h4 className="font-semibold text-primary mb-2">
                    100% Coverage
                  </h4>
                  <p className="text-sm text-secondary">
                    Every call answered, every opportunity captured
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}