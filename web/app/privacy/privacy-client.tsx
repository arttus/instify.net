'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Footer } from '@/components/sections/footer';

export default function PrivacyPageClient() {
  return (
    <>
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
                <Shield className="w-8 h-8 text-cyan" />
                <h1 className="heading-xl text-foreground">Privacy Policy</h1>
              </div>
              <p className="body-lg text-muted-foreground">
                Your privacy and the confidentiality of your legal practice are our highest priorities. 
                This policy outlines how we protect and handle your information.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Last updated: December 2024
              </p>
            </motion.div>
          </div>
        </section>

        {/* Privacy Principles */}
        <section className="py-16">
          <div className="site-container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="h-full bg-card/50 border-border text-center">
                  <CardContent className="p-6">
                    <Lock className="w-8 h-8 text-cyan mx-auto mb-4" />
                    <h3 className="heading-md mb-2 text-foreground">Attorney-Client Privilege</h3>
                    <p className="text-sm text-muted-foreground">
                      We understand and respect the sacred nature of attorney-client communications.
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
                    <Eye className="w-8 h-8 text-purple mx-auto mb-4" />
                    <h3 className="heading-md mb-2 text-foreground">Zero Data Mining</h3>
                    <p className="text-sm text-muted-foreground">
                      We never analyze, mine, or use your client data for any purpose other than service delivery.
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
                    <FileText className="w-8 h-8 text-cyan mx-auto mb-4" />
                    <h3 className="heading-md mb-2 text-foreground">Compliance First</h3>
                    <p className="text-sm text-muted-foreground">
                      HIPAA, SOC 2, and Bar Association compliant infrastructure and practices.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-16 bg-card/30">
          <div className="site-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="glass-strong">
                <CardContent className="p-8 md:p-12">
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    
                    <h2 className="heading-lg mb-6 text-foreground">Information We Collect</h2>
                    
                    <h3 className="heading-md mb-4 text-foreground">Law Firm Information</h3>
                    <ul className="mb-6 text-muted-foreground space-y-2">
                      <li>• Firm name, address, and contact information</li>
                      <li>• Attorney names and bar numbers (for verification purposes only)</li>
                      <li>• Practice areas and specializations</li>
                      <li>• Business hours and call handling preferences</li>
                    </ul>

                    <h3 className="heading-md mb-4 text-foreground">Call Data</h3>
                    <ul className="mb-6 text-muted-foreground space-y-2">
                      <li>• Caller phone numbers and basic contact information</li>
                      <li>• Call transcripts (encrypted and stored securely)</li>
                      <li>• Appointment scheduling information</li>
                      <li>• Call routing and transfer logs</li>
                    </ul>

                    <h2 className="heading-lg mb-6 text-foreground mt-12">How We Protect Your Information</h2>
                    
                    <h3 className="heading-md mb-4 text-foreground">Technical Safeguards</h3>
                    <ul className="mb-6 text-muted-foreground space-y-2">
                      <li>• End-to-end encryption for all communications</li>
                      <li>• SOC 2 Type II ready infrastructure</li>
                      <li>• Regular security audits and penetration testing</li>
                      <li>• Multi-factor authentication for all access</li>
                      <li>• Automated data backup with encryption at rest</li>
                    </ul>

                    <h3 className="heading-md mb-4 text-foreground">Legal Safeguards</h3>
                    <ul className="mb-6 text-muted-foreground space-y-2">
                      <li>• Business Associate Agreements (BAAs) for HIPAA compliance</li>
                      <li>• Attorney work product privilege protections</li>
                      <li>• Confidentiality agreements with all personnel</li>
                      <li>• Regular compliance training and certification</li>
                    </ul>

                    <h2 className="heading-lg mb-6 text-foreground mt-12">Data Usage and Sharing</h2>
                    
                    <div className="bg-cyan/10 border border-cyan/20 rounded-lg p-6 mb-6">
                      <h4 className="font-semibold text-foreground mb-2">Our Commitment:</h4>
                      <p className="text-muted-foreground">
                        We <strong>never</strong> sell, rent, or share your client data with third parties. 
                        Your information is used solely to provide our AI receptionist services to your firm.
                      </p>
                    </div>

                    <h3 className="heading-md mb-4 text-foreground">Permitted Uses</h3>
                    <ul className="mb-6 text-muted-foreground space-y-2">
                      <li>• Answering calls and scheduling appointments for your firm</li>
                      <li>• Providing call summaries and transcripts to authorized personnel</li>
                      <li>• System maintenance and security monitoring</li>
                      <li>• Compliance with legal obligations (court orders, subpoenas)</li>
                    </ul>

                    <h2 className="heading-lg mb-6 text-foreground mt-12">Your Rights</h2>
                    
                    <ul className="mb-6 text-muted-foreground space-y-2">
                      <li>• <strong>Access:</strong> Request copies of all data we have about your firm</li>
                      <li>• <strong>Correction:</strong> Update or correct any inaccurate information</li>
                      <li>• <strong>Deletion:</strong> Request deletion of your data (subject to legal retention requirements)</li>
                      <li>• <strong>Portability:</strong> Export your data in a standard format</li>
                      <li>• <strong>Restriction:</strong> Limit how we process your information</li>
                    </ul>

                    <h2 className="heading-lg mb-6 text-foreground mt-12">Contact Information</h2>
                    
                    <div className="bg-card border border-border rounded-lg p-6">
                      <p className="text-muted-foreground mb-4">
                        For privacy-related questions or to exercise your rights:
                      </p>
                      <div className="space-y-2 text-muted-foreground">
                        <p><strong>Privacy Officer:</strong> privacy@odeuo.com</p>
                        <p><strong>Phone:</strong> (844) 963-4740</p>
                        <p><strong>Mail:</strong> ODEUO AI Privacy Department</p>
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
