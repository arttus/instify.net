"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Calculator, TrendingUp, Clock, DollarSign, ArrowRight } from "lucide-react";

interface CalculatorInputs {
  attorneys: number;
  billingRate: number;
  monthlyLeads: number;
  missRate: number;
  adminCost: number;
  avgCaseValue: number;
  conversionRate: number;
}

export function ROICalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    attorneys: 2,
    billingRate: 300,
    monthlyLeads: 50,
    missRate: 35,
    adminCost: 4000,
    avgCaseValue: 8000,
    conversionRate: 25,
  });

  const [showResults, setShowResults] = useState(false);

  const calculateROI = () => {
    // Missed calls recovered
    const missedCallsPerMonth = (inputs.monthlyLeads * inputs.missRate) / 100;
    const recoveredCalls = missedCallsPerMonth;
    
    // Revenue from recovered calls
    const newConsultations = recoveredCalls * (inputs.conversionRate / 100);
    const monthlyRevenue = newConsultations * inputs.avgCaseValue;
    const annualRevenue = monthlyRevenue * 12;

    // Time savings
    const hoursFreedPerWeek = 10; // Conservative estimate
    const weeksPerYear = 50;
    const billableHoursSaved = hoursFreedPerWeek * weeksPerYear;
    const billableValueSaved = billableHoursSaved * inputs.billingRate;

    // Cost savings
    const receptionistCostSaved = 45000; // Annual full-time receptionist
    const aiReceptionistCost = 3000 * 12; // $3K/month
    const netCostSavings = receptionistCostSaved - aiReceptionistCost;

    // Total impact
    const totalAnnualImpact = annualRevenue + billableValueSaved + netCostSavings;
    const monthlyImpact = totalAnnualImpact / 12;
    const roi = ((totalAnnualImpact - aiReceptionistCost) / aiReceptionistCost) * 100;

    return {
      recoveredCalls: Math.round(recoveredCalls),
      monthlyRevenue: Math.round(monthlyRevenue),
      annualRevenue: Math.round(annualRevenue),
      billableHoursSaved: Math.round(billableHoursSaved),
      billableValueSaved: Math.round(billableValueSaved),
      netCostSavings: Math.round(netCostSavings),
      totalAnnualImpact: Math.round(totalAnnualImpact),
      monthlyImpact: Math.round(monthlyImpact),
      roi: Math.round(roi),
    };
  };

  const results = calculateROI();

  const handleCalculate = () => {
    setShowResults(true);
  };

  return (
    <section id="calculator" className="py-20 md:py-32 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block px-4 py-2 bg-accent/10 rounded-full text-accent font-semibold text-sm mb-4">
            ROI Calculator
          </div>
          <h2 className="heading-xl mb-6">
            Calculate Your Practice's Potential
          </h2>
          <p className="body-lg text-muted-foreground">
            See exactly how much revenue you're losing and how AI automation can transform your bottom line.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Calculator className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="heading-md">Your Practice Details</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="attorneys">Number of Attorneys</Label>
                    <Input
                      id="attorneys"
                      type="number"
                      value={inputs.attorneys}
                      onChange={(e) => setInputs({ ...inputs, attorneys: parseInt(e.target.value) || 0 })}
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billingRate">Average Billing Rate ($/hour)</Label>
                    <Input
                      id="billingRate"
                      type="number"
                      value={inputs.billingRate}
                      onChange={(e) => setInputs({ ...inputs, billingRate: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlyLeads">Monthly Incoming Calls</Label>
                    <Input
                      id="monthlyLeads"
                      type="number"
                      value={inputs.monthlyLeads}
                      onChange={(e) => setInputs({ ...inputs, monthlyLeads: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="missRate">Estimated Miss Rate (%)</Label>
                    <Input
                      id="missRate"
                      type="number"
                      value={inputs.missRate}
                      onChange={(e) => setInputs({ ...inputs, missRate: parseInt(e.target.value) || 0 })}
                      min="0"
                      max="100"
                    />
                    <p className="text-xs text-muted-foreground">Industry average: 35-50%</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avgCaseValue">Average Case Value ($)</Label>
                    <Input
                      id="avgCaseValue"
                      type="number"
                      value={inputs.avgCaseValue}
                      onChange={(e) => setInputs({ ...inputs, avgCaseValue: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conversionRate">Consultation to Client Rate (%)</Label>
                    <Input
                      id="conversionRate"
                      type="number"
                      value={inputs.conversionRate}
                      onChange={(e) => setInputs({ ...inputs, conversionRate: parseInt(e.target.value) || 0 })}
                      min="0"
                      max="100"
                    />
                  </div>

                  <Button
                    onClick={handleCalculate}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    size="lg"
                  >
                    Calculate My ROI
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="glass-card p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-success-green/10 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-success-green" />
                  </div>
                  <h3 className="heading-md">Your Potential Impact</h3>
                </div>

                {showResults ? (
                  <div className="space-y-6">
                    {/* Main Impact */}
                    <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
                      <div className="text-sm text-muted-foreground mb-2">Total Annual Impact</div>
                      <div className="text-4xl font-bold text-primary mb-1">
                        ${results.totalAnnualImpact.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ${results.monthlyImpact.toLocaleString()}/month
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg">
                        <DollarSign className="h-5 w-5 text-success-green mt-1" />
                        <div className="flex-1">
                          <div className="font-semibold mb-1">Revenue from Captured Calls</div>
                          <div className="text-2xl font-bold text-success-green">
                            ${results.annualRevenue.toLocaleString()}/year
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {results.recoveredCalls} calls/month recovered
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg">
                        <Clock className="h-5 w-5 text-primary mt-1" />
                        <div className="flex-1">
                          <div className="font-semibold mb-1">Billable Time Freed</div>
                          <div className="text-2xl font-bold text-primary">
                            ${results.billableValueSaved.toLocaleString()}/year
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {results.billableHoursSaved} billable hours saved
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-accent mt-1" />
                        <div className="flex-1">
                          <div className="font-semibold mb-1">Net Cost Savings</div>
                          <div className="text-2xl font-bold text-accent">
                            ${results.netCostSavings.toLocaleString()}/year
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            vs. full-time receptionist
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ROI */}
                    <div className="p-6 bg-gradient-to-br from-success-green/10 to-success-green/5 rounded-xl border-2 border-success-green/20">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-2">Return on Investment</div>
                        <div className="text-5xl font-bold text-success-green mb-2">
                          {results.roi}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Payback period: ~1 month
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-success-green to-success-green/80 hover:from-success-green/90 hover:to-success-green/70"
                        size="lg"
                      >
                        <a href="tel:+18449634740">
                          <Phone className="mr-2 h-5 w-5" />
                          Call for Live Demo: (844) 963-4740
                        </a>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full"
                        size="lg"
                      >
                        <a href="#audit">
                          Get Detailed Analysis
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </a>
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                      * Results based on industry averages and your inputs. Actual results may vary.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[400px]">
                    <div className="text-center text-muted-foreground">
                      <Calculator className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <p>Enter your practice details and click Calculate to see your potential ROI</p>
                    </div>
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