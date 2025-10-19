"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, DollarSign, Clock } from "lucide-react";

export function ROICalculator() {
  const [attorneys, setAttorneys] = useState(3);
  const [caseValue, setCaseValue] = useState(15000);
  const [missedCalls, setMissedCalls] = useState(5);
  const [receptionistCost, setReceptionistCost] = useState(50000);

  // Calculations
  const annualMissedCalls = missedCalls * 52;
  const captureRate = 0.5; // 50% of missed calls convert
  const newCases = annualMissedCalls * captureRate;
  const revenueCapture = newCases * caseValue;
  const timeSaved = attorneys * 10 * 52; // 10 hours per attorney per week
  const billingRate = 300;
  const timeSavedValue = timeSaved * billingRate;
  const totalAnnualImpact = revenueCapture + timeSavedValue;
  const estimatedCost = 4000 * 12; // $4K/month
  const roi = ((totalAnnualImpact - estimatedCost) / estimatedCost) * 100;

  return (
    <section id="roi" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg text-primary mb-4">
            Calculate Your Potential ROI
          </h2>
          <p className="body-lg text-secondary max-w-3xl mx-auto">
            See how much revenue you could capture and time you could save with
            AI automation.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="mr-2 h-5 w-5 text-accent" />
                    Your Practice Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="attorneys">Number of Attorneys</Label>
                    <Input
                      id="attorneys"
                      type="number"
                      value={attorneys}
                      onChange={(e) => setAttorneys(Number(e.target.value))}
                      min={1}
                      max={50}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="caseValue">Average Case Value ($)</Label>
                    <Input
                      id="caseValue"
                      type="number"
                      value={caseValue}
                      onChange={(e) => setCaseValue(Number(e.target.value))}
                      min={1000}
                      step={1000}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="missedCalls">
                      Estimated Missed Calls Per Week
                    </Label>
                    <Input
                      id="missedCalls"
                      type="number"
                      value={missedCalls}
                      onChange={(e) => setMissedCalls(Number(e.target.value))}
                      min={1}
                      max={100}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="receptionistCost">
                      Current Receptionist Cost ($/year)
                    </Label>
                    <Input
                      id="receptionistCost"
                      type="number"
                      value={receptionistCost}
                      onChange={(e) =>
                        setReceptionistCost(Number(e.target.value))
                      }
                      min={0}
                      step={5000}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-card h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-automation-cyan" />
                    Your Projected Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Revenue from Captured Calls
                      </span>
                      <DollarSign className="h-4 w-4 text-accent" />
                    </div>
                    <div className="text-3xl font-bold text-accent">
                      ${revenueCapture.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {newCases.toFixed(0)} new cases annually
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-automation-cyan/5 border border-automation-cyan/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Billable Hours Saved
                      </span>
                      <Clock className="h-4 w-4 text-automation-cyan" />
                    </div>
                    <div className="text-3xl font-bold text-automation-cyan">
                      ${timeSavedValue.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {timeSaved.toLocaleString()} hours annually
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Total Annual Impact
                      </span>
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      ${totalAnnualImpact.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {roi.toFixed(0)}% ROI
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full" size="lg">
                      Get Detailed Analysis
                    </Button>
                  </motion.div>

                  <p className="text-xs text-muted-foreground text-center">
                    Based on industry averages and conservative estimates
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}