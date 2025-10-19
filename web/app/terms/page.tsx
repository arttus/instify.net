'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Scale, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Header } from '@/components/sections/header';
import { Footer } from '@/components/sections/footer';

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-purple/5 to-background">
          <div className="site-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-4xl mx-auto mb-16"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <Scale className="w-8 h-8 text-purple" />
                <h1 className="heading-xl text-foreground">Terms of Service</h1>
              </div>
              <p className="body-lg text-muted-foreground">
                Professional terms designed for legal practices. Clear, comprehensive, 
                and compliant with legal industry standards.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Last updated: December 2024
              </p>
            </motion.div>
          </div>
        </section>

        {/* Key Terms Highlights */}
        <section className="py-16">
          <div className="site-container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="h-full bg-card/50 border-border text-center">
                  <CardContent className="p-6">
                    <Shield className="w-8 h-8 text-cyan mx-auto mb-4" />
                    <h3 className="heading-sm mb-2 text-foreground">Professional Standards</h3>
                    <p className="text-xs text-muted-foreground">
                      Designed for legal professionals with industry-specific protections
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="h-full bg-card/50 border-border text-center">
                  <CardContent className="p-6">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-4" />
                    <h3 className="heading-sm mb-2 text-foreground">Service Guarantees</h3>
                    <p className="text-xs text-muted-foreground">
                      99.9% uptime SLA with professional liability coverage
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="h-full bg-card/50 border-border text-center">
                  <CardContent className="p-6">
                    <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
                    <h3 className="heading-sm mb-2 text-foreground">Ethical Compliance</h3>
                    <p className="text-xs text-muted-foreground">
                      Full compliance with Model Rules of Professional Conduct
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="h-full bg-card/50 border-border text-center">
                  <CardContent className="p-6">
                    <Scale className="w-8 h-8 text-purple mx-auto mb-4" />
                    <h3 className="heading-sm mb-2 text-foreground">Legal Protection</h3>
                    <p className="text-xs text-muted-foreground">
                      Comprehensive indemnification and liability limitations
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16 bg-card/30">
          <div className="site-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="glass-strong">
                <CardContent className="p-8 md:p-12">
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    
                    <h2 className="heading-lg mb-6 text-foreground">Service Agreement</h2>
                    
                    <p className="mb-6 text-muted-foreground">
                      This Terms of Service Agreement ("Agreement") is entered into between ODEUO AI ("Company," "we," "us") 
                      and the subscribing law firm or legal professional ("Client," "you," "your").
                    </p>

                    <h3 className="heading-md mb-4 text-foreground">1. Service Description</h3>
                    <p className="mb-4 text-muted-foreground">
                      ODEUO AI provides artificial intelligence-powered receptionist services specifically designed for legal practices, including:
                    </p>
                    <ul className="mb-6 text-muted-foreground space-y-2">
                      <li>• 24/7 call answering and client intake</li>
                      <li>• Appointment scheduling and calendar management</li>
                      <li>• Call screening and routing to appropriate personnel</li>
                      <li>• Basic legal information (non-advisory) responses</li>
                      <li>• Secure message taking and client communication</li>
                    </ul>

                    <h3 className="heading-md mb-4 text-foreground">2. Professional Responsibility Compliance</h3>
                    
                    <div className="bg-purple/10 border border-purple/20 rounded-lg p-6 mb-6">
                      <h4 className="font-semibold text-foreground mb-2">Ethical Safeguards:</h4>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• No legal advice provided by AI system</li>
                        <li>• Attorney-client privilege protections maintained</li>
                        <li>• Conflict of interest screening protocols</li>
                        <li>• Compliance with Model Rules 1.1, 1.6, and 5.3</li>
                      </ul>
                    </div>

                    <h3 className="heading-md mb-4 text-foreground">3. Service Level Agreement</h3>
                    <ul className="mb-6 text-muted-foreground space-y-2">
                      <li>• <strong>Uptime Guarantee:</strong> 99.9% monthly uptime</li>
                      <li>• <strong>Response Time:</strong> Calls answered within 3 rings</li>
                      <li>• <strong>Message Delivery:</strong> Urgent messages delivered within 5 minutes</li>
                      <li>• <strong>System Recovery:</strong> Maximum 4-hour recovery time for outages</li>
                    </ul>

                    <h3 className="heading-md mb-4 text-foreground">4. Client Responsibilities</h3>
                    <ul className="mb-6 text-muted-foreground space-y-2">
                      <li>• Provide accurate firm information and call handling instructions</li>
                      <li>• Maintain current attorney licensing and bar standing</li>
                      <li>• Review and approve AI responses for accuracy</li>
                      <li>• Promptly respond to urgent client matters</li>
                      <li>• Comply with applicable legal ethics rules</li>
                    </ul>

                    <h3 className="heading-md mb-4 text-foreground">5. Confidentiality and Security</h3>
                    <p className="mb-4 text-muted-foreground">
                      We maintain the highest standards of confidentiality consistent with legal industry requirements:
                    </p>
                    <ul className="mb-6 text-muted-foreground space-y-2">
                      <li>• All communications encrypted in transit and at rest</li>
                      <li>• odeuo.com SOC 2 Type II ready security controls</li>
                      <li>• Business Associate Agreement (BAA) for HIPAA compliance</li>
                      <li>• Regular security audits and compliance reviews</li>
                      <li>• Incident response and breach notification procedures</li>
                    </ul>

                    <h3 className="heading-md mb-4 text-foreground">6. Limitation of Liability</h3>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
                      <h4 className="font-semibold text-foreground mb-2">Important Legal Limitations:</h4>
                      <p className="text-muted-foreground text-sm">
                        Our liability is limited to the monthly service fees paid. We maintain professional liability 
                        insurance but cannot be held responsible for legal malpractice claims arising from your practice. 
                        You retain full professional responsibility for all client matters.
                      </p>
                    </div>

                    <h3 className="heading-md mb-4 text-foreground">7. Termination</h3>
                    <ul className="mb-6 text-muted-foreground space-y-2">
                      <li>• Either party may terminate with 30 days written notice</li>
                      <li>• Immediate termination for material breach or ethical violations</li>
                      <li>• Data export provided within 30 days of termination</li>
                      <li>• Secure data deletion within 90 days unless legally required to retain</li>
                    </ul>

                    <h3 className="heading-md mb-4 text-foreground">8. Indemnification</h3>
                    <p className="mb-6 text-muted-foreground">
                      Client agrees to indemnify Company against claims arising from: (a) Client's violation of professional 
                      conduct rules, (b) unauthorized modifications to service protocols, (c) failure to supervise AI interactions 
                      as required by applicable ethics rules, and (d) any legal malpractice claims related to Client's practice.
                    </p>

                    <h3 className="heading-md mb-4 text-foreground">9. Governing Law</h3>
                    <p className="mb-6 text-muted-foreground">
                      This Agreement is governed by the laws of [State] and subject to the jurisdiction of [State] courts. 
                      Any disputes will be resolved through binding arbitration under the American Arbitration Association 
                      Commercial Rules.
                    </p>

                    <h2 className="heading-lg mb-6 text-foreground mt-12">Contact Information</h2>
                    
                    <div className="bg-card border border-border rounded-lg p-6">
                      <p className="text-muted-foreground mb-4">
                        For questions about these terms or legal compliance:
                      </p>
                      <div className="space-y-2 text-muted-foreground">
                        <p><strong>Legal Department:</strong> legal@odeuo.com</p>
                        <p><strong>Phone:</strong> (844) 963-4740</p>
                    
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
