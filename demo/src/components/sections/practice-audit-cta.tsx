"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Calendar, CheckCircle2, Clock, Users } from "lucide-react";
import { useState } from "react";

export function PracticeAuditCTA() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    firmName: "",
    attorneys: "",
    practiceArea: "",
    painPoints: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with your backend/email service
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  return (
    <section id="audit" className="py-20 md:py-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm mb-4">
            Free Practice Transformation Audit
          </div>
          <h2 className="heading-xl mb-6">
            Ready to Transform Your Practice?
          </h2>
          <p className="body-lg text-muted-foreground">
            Schedule a free 45-minute consultation. We'll analyze your current operations and show you exactly how AI automation can increase revenue and free your time.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1 space-y-6"
            >
              <Card className="glass-card p-6">
                <h3 className="heading-md mb-6">What You'll Get</h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: Calendar,
                      title: "45-Minute Consultation",
                      description: "Deep dive into your practice operations and pain points"
                    },
                    {
                      icon: CheckCircle2,
                      title: "Custom Analysis",
                      description: "Specific recommendations for your practice area and size"
                    },
                    {
                      icon: Clock,
                      title: "ROI Projection",
                      description: "Detailed financial impact analysis with implementation timeline"
                    },
                    {
                      icon: Users,
                      title: "No Obligation",
                      description: "Free consultation with zero pressure to commit"
                    }
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <benefit.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm mb-1">{benefit.title}</div>
                        <div className="text-xs text-muted-foreground">{benefit.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="glass-card p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">$0</div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Completely free consultation
                  </div>
                  <div className="text-xs text-muted-foreground">
                    No credit card required. No strings attached.
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="glass-card p-8">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Smith"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@lawfirm.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="firmName">Law Firm Name *</Label>
                        <Input
                          id="firmName"
                          required
                          value={formData.firmName}
                          onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                          placeholder="Smith & Associates"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="attorneys">Number of Attorneys *</Label>
                        <Select
                          value={formData.attorneys}
                          onValueChange={(value) => setFormData({ ...formData, attorneys: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solo">Solo Practitioner</SelectItem>
                            <SelectItem value="2-5">2-5 Attorneys</SelectItem>
                            <SelectItem value="6-10">6-10 Attorneys</SelectItem>
                            <SelectItem value="11-20">11-20 Attorneys</SelectItem>
                            <SelectItem value="20+">20+ Attorneys</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="practiceArea">Primary Practice Area *</Label>
                        <Select
                          value={formData.practiceArea}
                          onValueChange={(value) => setFormData({ ...formData, practiceArea: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal-injury">Personal Injury</SelectItem>
                            <SelectItem value="family-law">Family Law</SelectItem>
                            <SelectItem value="estate-planning">Estate Planning</SelectItem>
                            <SelectItem value="criminal-defense">Criminal Defense</SelectItem>
                            <SelectItem value="immigration">Immigration</SelectItem>
                            <SelectItem value="business-law">Business Law</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="painPoints">What are your biggest challenges? *</Label>
                      <Textarea
                        id="painPoints"
                        required
                        value={formData.painPoints}
                        onChange={(e) => setFormData({ ...formData, painPoints: e.target.value })}
                        placeholder="e.g., Missing calls, spending too much time on admin work, slow response times..."
                        rows={4}
                      />
                    </div>

                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <input type="checkbox" required className="mt-1" />
                      <span>
                        I agree to receive communications about AI automation solutions for my law practice. 
                        I understand I can unsubscribe at any time.
                      </span>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg"
                    >
                      Schedule My Free Audit
                      <Calendar className="ml-2 h-5 w-5" />
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      We'll contact you within 24 hours to schedule your consultation at a time that works for you.
                    </p>
                  </form>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-success-green/10 rounded-full mb-6">
                      <CheckCircle2 className="h-8 w-8 text-success-green" />
                    </div>
                    <h3 className="heading-md mb-4">Thank You!</h3>
                    <p className="body-md text-muted-foreground mb-6">
                      We've received your request for a free practice transformation audit. 
                      Our team will contact you within 24 hours to schedule your consultation.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Check your email for confirmation and preparation materials.
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}