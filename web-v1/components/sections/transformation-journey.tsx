"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, FileText, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function TransformationJourney() {
  const phases = [
    {
      phase: "Phase 1",
      icon: Phone,
      title: "AI Voice Receptionist",
      description: "24/7 phone coverage that works alongside your team",
      results: "35-60% increase in consultation bookings",
      status: "start-here" as const,
    },
    {
      phase: "Phase 2",
      icon: MessageSquare,
      title: "Multi-Channel Lead Capture",
      description: "Expand to text, email, and social media automation",
      results: "40-50% increase in total lead capture",
      status: "future" as const,
    },
    {
      phase: "Phase 3",
      icon: FileText,
      title: "Practice Operations",
      description: "Automate intake, documents, and client communication",
      results: "10-15 attorney hours freed weekly",
      status: "future" as const,
    },
    {
      phase: "Phase 4",
      icon: TrendingUp,
      title: "Strategic Growth",
      description: "Advanced systems for scaling and optimization",
      results: "25-50% sustainable annual growth",
      status: "future" as const,
    },
  ];

  return (
    <section id="transformation" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg text-primary mb-4">
            Start with phone coverage. Scale to full practice automation.
          </h2>
          <p className="body-lg text-secondary max-w-3xl mx-auto">
            Our phased approach lets you start with a quick win and expand
            systematically based on ROI and your firm's readiness.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {phases.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
            >
              <Card
                className={`h-full relative overflow-hidden ${
                  phase.status === "start-here"
                    ? "ring-2 ring-accent shadow-lg"
                    : ""
                }`}
              >
                <CardContent className="p-5">
                  {phase.status === "start-here" && (
                    <Badge className="absolute top-3 right-3 bg-accent text-xs">
                      Start Here
                    </Badge>
                  )}
                  
                  <div className="flex gap-3 mb-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          phase.status === "start-here"
                            ? "bg-accent/10"
                            : "bg-primary/10"
                        }`}
                      >
                        <phase.icon
                          className={`h-6 w-6 ${
                            phase.status === "start-here"
                              ? "text-accent"
                              : "text-primary"
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-muted-foreground mb-1">
                        {phase.phase}
                      </div>
                      <h3 className="heading-sm text-primary mb-2">
                        {phase.title}
                      </h3>
                    </div>
                  </div>

                  <p className="body-base text-secondary mb-4">
                    {phase.description}
                  </p>

                  <div className="pt-3 border-t border-border">
                    <div className="text-sm font-medium text-automation-cyan">
                      {phase.results}
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
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Each phase builds on the previous one. Start with Phase 1 and expand
            when you're ready.
          </p>
        </motion.div>
      </div>
    </section>
  );
}