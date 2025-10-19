'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, TrendingUp, Phone, Calendar, DollarSign, Clock, Users, CheckCircle } from 'lucide-react';
import { Header } from '@/components/sections/header';
import { Footer } from '@/components/sections/footer';
import { trackDemoRequest, trackConsultationRequest } from '@/components/analytics';
import { calculateROI, firmSizeOptions, type ROIInputs, type ROIResults } from '@/lib/roi-calculator';

export default function ROICalculatorClient() {
  const [inputs, setInputs] = useState<ROIInputs>({
    firmSize: 'small',
    avgCaseValue: 8000, // More realistic average case value for small firms
    missedCallsPerWeek: 5, // More conservative missed calls estimate
    afterHoursCalls: 8, // More realistic after-hours call volume
    receptionistSalary: 42000, // Realistic receptionist salary
    overtimeCosts: 6000 // More conservative overtime costs
  });

  const [results, setResults] = useState<ROIResults>({
    currentLoss: 0,
    potentialRevenue: 0,
    annualSavings: 0,
    roiPercentage: 0,
    paybackMonths: 0,
    fiveYearValue: 0
  });

  const [showResults, setShowResults] = useState(false);

  const handleCalculateROI = () => {
    const results = calculateROI(inputs);
    setResults(results);
    setShowResults(true);
  };

  const handleInputChange = (field: keyof ROIInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDemoRequest = () => {
    trackDemoRequest();
  };

  const handleConsultationRequest = () => {
    trackConsultationRequest();
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-cyan/5 to-background">
          <div className="site-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-4xl mx-auto mb-16"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <Calculator className="w-8 h-8 text-cyan" />
                <h1 className="heading-xl text-foreground">
                  ROI Calculator
                </h1>
              </div>
              <p className="body-lg text-muted-foreground mb-8">
                Calculate the exact financial impact of implementing ODEUO AI's 24/7 receptionist 
                for your law practice. See your potential revenue increase and cost savings.
              </p>
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan" />
                  <span>Based on real client data</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan" />
                  <span>Industry-specific metrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan" />
                  <span>Conservative estimates</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-16">
          <div className="site-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
              
              {/* Input Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="glass-strong border-cyan/20">
                  <CardContent className="p-8">
                    <h2 className="heading-lg mb-6 text-foreground">Your Practice Details</h2>
                    
                    {/* Firm Size */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-foreground mb-3">
                        Firm Size
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {firmSizeOptions.map((option) => (
                          <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-cyan/30 cursor-pointer transition-colors">
                            <input
                              type="radio"
                              name="firmSize"
                              value={option.value}
                              checked={inputs.firmSize === option.value}
                              onChange={(e) => handleInputChange('firmSize', e.target.value)}
                              className="text-cyan focus:ring-cyan"
                            />
                            <span className="text-sm text-foreground">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Average Case Value */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Average Case Value ($)
                      </label>
                      <input
                        type="number"
                        value={inputs.avgCaseValue}
                        onChange={(e) => handleInputChange('avgCaseValue', parseInt(e.target.value) || 0)}
                        className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:border-cyan focus:ring-1 focus:ring-cyan"
                        placeholder="8000"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Lifetime value of an average client
                      </p>
                    </div>

                    {/* Missed Calls */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Missed Calls Per Week
                      </label>
                      <input
                        type="number"
                        value={inputs.missedCallsPerWeek}
                        onChange={(e) => handleInputChange('missedCallsPerWeek', parseInt(e.target.value) || 0)}
                        className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:border-cyan focus:ring-1 focus:ring-cyan"
                        placeholder="5"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        During business hours (busy, meetings, etc.)
                      </p>
                    </div>

                    {/* After Hours Calls */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        After-Hours Calls Per Week
                      </label>
                      <input
                        type="number"
                        value={inputs.afterHoursCalls}
                        onChange={(e) => handleInputChange('afterHoursCalls', parseInt(e.target.value) || 0)}
                        className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:border-cyan focus:ring-1 focus:ring-cyan"
                        placeholder="8"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Evenings, weekends, holidays
                      </p>
                    </div>

                    {/* Receptionist Salary */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Annual Receptionist Salary ($)
                      </label>
                      <input
                        type="number"
                        value={inputs.receptionistSalary}
                        onChange={(e) => handleInputChange('receptionistSalary', parseInt(e.target.value) || 0)}
                        className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:border-cyan focus:ring-1 focus:ring-cyan"
                        placeholder="42000"
                      />
                    </div>

                    {/* Overtime Costs */}
                    <div className="mb-8">
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Annual Overtime/Coverage Costs ($)
                      </label>
                      <input
                        type="number"
                        value={inputs.overtimeCosts}
                        onChange={(e) => handleInputChange('overtimeCosts', parseInt(e.target.value) || 0)}
                        className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:border-cyan focus:ring-1 focus:ring-cyan"
                        placeholder="6000"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Temp staff, overtime pay, vacation coverage
                      </p>
                    </div>

                    <Button
                      onClick={handleCalculateROI}
                      className="w-full gradient-cyan-purple text-white font-semibold py-3"
                    >
                      <Calculator className="w-5 h-5 mr-2" />
                      Calculate My ROI
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {showResults ? (
                  <Card className="glass-strong border-purple/20">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="w-6 h-6 text-purple" />
                        <h2 className="heading-lg text-foreground">Your ROI Analysis</h2>
                      </div>

                      <div className="space-y-6">
                        {/* Current Loss */}
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">Current Annual Loss</span>
                            <span className="text-xl font-bold text-red-500">
                              ${results.currentLoss.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Revenue lost from missed opportunities
                          </p>
                        </div>

                        {/* Potential Revenue */}
                        <div className="p-4 rounded-lg bg-cyan/10 border border-cyan/20">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">Potential Revenue Recovery</span>
                            <span className="text-xl font-bold text-cyan">
                              ${results.potentialRevenue.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Annual revenue from captured calls
                          </p>
                        </div>

                        {/* Operational Savings */}
                        <div className="p-4 rounded-lg bg-purple/10 border border-purple/20">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">Operational Savings</span>
                            <span className="text-xl font-bold text-purple">
                              ${results.annualSavings.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Reduced overtime and efficiency gains
                          </p>
                        </div>

                        {/* ROI Percentage */}
                        <div className="p-4 rounded-lg bg-gradient-to-r from-cyan/10 to-purple/10 border border-cyan/20">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">Return on Investment</span>
                            <span className="text-2xl font-bold gradient-text-cyan-purple">
                              {results.roiPercentage.toFixed(0)}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Annual ROI on AI investment
                          </p>
                        </div>

                        {/* Payback Period */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 rounded-lg bg-card border border-border">
                            <div className="text-lg font-bold text-foreground">
                              {results.paybackMonths.toFixed(1)} months
                            </div>
                            <div className="text-xs text-muted-foreground">Payback Period</div>
                          </div>
                          <div className="p-3 rounded-lg bg-card border border-border">
                            <div className="text-lg font-bold text-foreground">
                              ${results.fiveYearValue.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">5-Year Value</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="glass-strong border-border/50">
                    <CardContent className="p-8 text-center">
                      <Calculator className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="heading-md text-muted-foreground mb-2">
                        Enter Your Details
                      </h3>
                      <p className="text-muted-foreground">
                        Fill out the form on the left to see your personalized ROI analysis
                      </p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-b from-background to-cyan/5">
          <div className="site-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="mb-8">
                <h2 className="heading-xl mb-6 text-foreground">
                  Ready to <span className="gradient-text-cyan">Transform</span> Your Practice?
                </h2>
                <p className="body-lg text-muted-foreground mb-8">
                  {showResults ? (
                    <>
                      Based on your calculations, you could save <strong className="text-cyan">${results.currentLoss.toLocaleString()}</strong> annually
                      and achieve a <strong className="text-purple">{results.roiPercentage.toFixed(0)}%</strong> ROI.
                      Let's make it happen.
                    </>
                  ) : (
                    <>
                      Don't let another missed call cost you thousands. Experience our AI receptionist
                      live and see exactly how we can transform your practice.
                    </>
                  )}
                </p>
              </div>

              {/* Contact Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
                <Card className="glass-strong border-cyan/20 hover:border-cyan/40 transition-all">
                  <CardContent className="p-6 text-center">
                    <Phone className="w-8 h-8 text-cyan mx-auto mb-4" />
                    <h3 className="heading-md mb-2 text-foreground">Call for Live Demo</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Try our AI receptionist right now
                    </p>
                    <Button
                      asChild
                      className="w-full gradient-cyan text-white font-semibold"
                      onClick={handleDemoRequest}
                    >
                      <a href="tel:8449634740">
                        <Phone className="w-4 h-4 mr-2" />
                        (844) 963-4740
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-strong border-purple/20 hover:border-purple/40 transition-all">
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-8 h-8 text-purple mx-auto mb-4" />
                    <h3 className="heading-md mb-2 text-foreground">Schedule Consultation</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get a custom implementation plan
                    </p>
                    <Button
                      asChild
                      className="w-full gradient-purple text-white font-semibold"
                      onClick={handleConsultationRequest}
                    >
                      <a href="/contact">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Meeting
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan" />
                  <span>7-14 day setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan" />
                  <span>HIPAA-ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan" />
                  <span>Bar Association compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan" />
                  <span>No long-term contracts</span>
                </div>
              </div>

              {/* Additional Value Props */}
              <div className="mt-12 p-6 rounded-xl bg-card/50 border border-border">
                <h3 className="heading-md mb-4 text-foreground">What Happens Next?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan to-purple flex items-center justify-center text-white font-bold text-sm mb-3">
                      1
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Discovery Call</h4>
                    <p className="text-sm text-muted-foreground">
                      We analyze your current call patterns and identify opportunities
                    </p>
                  </div>
                  <div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan to-purple flex items-center justify-center text-white font-bold text-sm mb-3">
                      2
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Custom Setup</h4>
                    <p className="text-sm text-muted-foreground">
                      We configure the AI with your practice areas and preferences
                    </p>
                  </div>
                  <div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan to-purple flex items-center justify-center text-white font-bold text-sm mb-3">
                      3
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Go Live</h4>
                    <p className="text-sm text-muted-foreground">
                      Start capturing every call and growing your practice
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
