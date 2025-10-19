"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

export function FAQSection() {
  const faqs = [
    {
      question: "What if clients want to talk to a real person?",
      answer:
        "The AI can transfer calls to your receptionist or attorneys anytime during business hours. If someone requests a human, we immediately offer to transfer them or schedule a callback. During business hours, it works as intelligent call screening and overflow. After hours, it ensures they get professional help rather than voicemail.",
    },
    {
      question: "How does it work with our existing receptionist?",
      answer:
        "This isn't a replacement for your receptionist—it's backup for when they're unavailable. Your receptionist handles calls during business hours; AI handles overflow when they're busy and provides complete coverage after hours, during lunch, meetings, and vacations. It reduces stress on staff while maintaining the human touch clients appreciate.",
    },
    {
      question: "Is AI professional enough for legal clients?",
      answer:
        "Our AI is trained specifically for legal communications with appropriate professional tone, legal terminology, and ethical awareness. Clients consistently rate it as professional and helpful—many don't realize they're speaking with AI. It works alongside your receptionist to maintain your firm's standards.",
    },
    {
      question: "What if it makes a mistake?",
      answer:
        "The AI is programmed to never provide legal advice and to transfer complex questions to attorneys. It handles routine inquiries, scheduling, and intake—exactly what a human receptionist would do, with perfect consistency. During business hours, it can transfer to your receptionist for anything nuanced.",
    },
    {
      question: "How long does implementation take?",
      answer:
        "Phase 1 (AI Receptionist) typically deploys in 7-14 days. We handle the technical setup—you just provide us with common questions, your scheduling preferences, and practice-specific information. Most firms are up and running within two weeks.",
    },
    {
      question: "Will this upset our current staff?",
      answer:
        "Actually, most receptionists love it. They're thrilled to have backup during busy times and to know calls are covered when they're off. It reduces their stress and improves their work-life balance. Frame it as 'you're getting an assistant' not 'you're being replaced.'",
    },
    {
      question: "How is this different from other legal tech?",
      answer:
        "We're not a software vendor—we're a transformation partner. We implement, train, optimize, and support. You get a dedicated success manager, ongoing optimization, and phased growth. You focus on law; we handle the technology.",
    },
    {
      question: "What about client confidentiality and security?",
      answer:
        "We employ enterprise-grade security, encryption, and access controls. Our systems are SOC 2 compliant and designed to protect attorney-client privilege. The AI is trained to recognize sensitive information and handle it appropriately, with all data encrypted in transit and at rest.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg text-primary mb-4">
            Common questions from law firms like yours
          </h2>
          <p className="body-lg text-secondary max-w-3xl mx-auto">
            We've helped dozens of law firms transform their practices. Here are
            the questions we hear most often.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold text-primary">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-secondary body-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}