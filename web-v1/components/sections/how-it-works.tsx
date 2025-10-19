"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Bot, TrendingUp, Play } from "lucide-react";
import { motion } from "framer-motion";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: BookOpen,
      title: "We learn your practice",
      description:
        "Share your common questions, scheduling preferences, and practice-specific information. We configure the AI to match your firm's voice and processes.",
      image: "https://images.unsplash.com/photo-1606223226391-c267641c318c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxsYXclMjBvZmZpY2UlMjBkZXNrJTIwcHJvZmVzc2lvbmFsJTIwaW50ZXJpb3IlMjBidXNpbmVzcyUyMHNldHRpbmd8ZW58MHwwfHxibHVlfDE3NjA3MzczMTV8MA&ixlib=rb-4.1.0&q=85",
    },
    {
      number: "02",
      icon: Bot,
      title: "AI handles overflow & after-hours",
      description:
        "Your receptionist takes calls during business hours. AI seamlessly handles overflow when they're busy and provides complete coverage after hours.",
      image: "https://images.unsplash.com/photo-1643409471378-cdab0f97d983?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxuZXVyYWwlMjBuZXR3b3JrJTIwdGVjaG5vbG9neSUyMHBhdHRlcm4lMjBkaWdpdGFsJTIwYWJzdHJhY3QlMjBBSSUyMHZpc3VhbGl6YXRpb258ZW58MHwwfHxwdXJwbGV8MTc2MDczNzMxNXww&ixlib=rb-4.1.0&q=85",
    },
    {
      number: "03",
      icon: TrendingUp,
      title: "You capture every opportunity",
      description:
        "Track results with detailed metrics: calls captured, consultations booked, revenue generated. See the ROI in real-time.",
      image: "https://images.unsplash.com/photo-1516315720917-231ef9acce48?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw3fHxsYXclMjBvZmZpY2UlMjBkZXNrJTIwcHJvZmVzc2lvbmFsJTIwaW50ZXJpb3IlMjBidXNpbmVzcyUyMHNldHRpbmd8ZW58MHwwfHxibHVlfDE3NjA3MzczMTV8MA&ixlib=rb-4.1.0&q=85",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg text-primary mb-4">How It Works</h2>
          <p className="body-lg text-secondary max-w-3xl mx-auto">
            Get started in three simple steps. We handle the technical setup—you
            just provide the information.
          </p>
        </motion.div>

        <div className="space-y-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-8 items-center`}
              >
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center mb-6">
                    <div className="text-6xl font-bold text-accent/20 mr-4">
                      {step.number}
                    </div>
                    <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center">
                      <step.icon className="h-8 w-8 text-accent" />
                    </div>
                  </div>
                  <h3 className="heading-md text-primary mb-4">{step.title}</h3>
                  <p className="body-lg text-secondary mb-6">
                    {step.description}
                  </p>
                  {index === 1 && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" className="group">
                        <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        Listen to Demo Call
                      </Button>
                    </motion.div>
                  )}
                </div>

                {/* Image */}
                <div className="flex-1">
                  <Card className="overflow-hidden">
                    <img
                      src={step.image}
                      alt={`${step.title} - Arthur Lambillotte on Unsplash`}
                      className="w-full h-80 object-cover"
                    />
                  </Card>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}