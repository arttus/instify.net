'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How is ODUEO different from generic automation tools?',
    answer: 'ODUEO is built specifically for legal practices with deep understanding of legal workflows, terminology, and compliance requirements. Our AI is trained on legal-specific use cases and integrates seamlessly with legal practice management systems.',
  },
  {
    question: 'What\'s the typical ROI timeline?',
    answer: 'Most firms see measurable ROI within 2-4 weeks of implementation. On average, firms save 520+ hours per attorney annually and reclaim $156K in annual value through reduced manual work and improved efficiency.',
  },
  {
    question: 'How does ODUEO ensure attorney-client privilege?',
    answer: 'ODUEO is built with legal industry security standards including SOC 2 compliance, end-to-end encryption, and strict data handling protocols. All AI processing respects attorney-client privilege and confidentiality requirements.',
  },
  {
    question: 'Can ODUEO integrate with our existing case management system?',
    answer: 'Yes, ODUEO integrates with major legal practice management platforms including Clio, MyCase, PracticePanther, and others. We provide seamless data sync and workflow automation across your existing tools.',
  },
  {
    question: 'What level of customization is available?',
    answer: 'ODUEO offers extensive customization to match your firm\'s specific workflows, document templates, and processes. During the configuration phase, we tailor the automation to your practice area and operational needs.',
  },
  {
    question: 'Do we need technical expertise to use ODUEO?',
    answer: 'No technical expertise required. ODUEO is designed for legal professionals, not IT teams. We handle all technical setup, integration, and ongoing maintenance. Your team simply uses the intuitive interface.',
  },
];

export function FAQSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="heading-xl mb-4">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
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