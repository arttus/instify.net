'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form-input';
import { Label } from '@/components/ui/form-label';
import { Textarea } from '@/components/ui/form-textarea';
import { Phone, Mail, MapPin, Calendar, Send, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Header } from '@/components/sections/header';
import { Footer } from '@/components/sections/footer';
import { trackPhoneCall, trackContactForm } from '@/components/analytics';

export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Listen for messages from Cal.com iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === 'https://app.cal.com') {
        if (event.data?.type === 'booking_successful') {
          console.log('Cal.com booking successful:', event.data);
          handleCalBooking();
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Inject CSS to hide Cal.com logo
    const style = document.createElement('style');
    style.textContent = `
      iframe[src*="cal.com"] {
        /* Additional styles to hide branding */
      }
      /* Hide Cal.com logo in iframe - this targets the specific element structure */
      .cal-embed iframe {
        margin-bottom: -50px !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const handlePhoneClick = () => {
    trackPhoneCall();
  };

  const handleEmailClick = () => {
    trackContactForm('email');
  };

  const handleCalBooking = () => {
    trackContactForm('cal-booking');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would integrate with your backend/email service
      console.log('Contact form submitted:', formData);
      trackContactForm('contact-form');

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="heading-xl mb-6 text-foreground">
              Let's <span className="gradient-text-cyan">Transform</span> Your Practice
            </h1>
            <p className="body-lg text-muted-foreground">
              Schedule a call with our team to see how ODEUO AI can help you capture every opportunity 
              and never miss another call.
            </p>
          </motion.div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full bg-card/50 border-border hover:border-cyan/30 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-cyan/10 flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-cyan" />
                  </div>
                  <h3 className="heading-md mb-2 text-foreground">Call Us</h3>
                  <a 
                    href="tel:8449634740" 
                    onClick={handlePhoneClick}
                    className="text-cyan hover:text-cyan/80 transition-colors font-semibold"
                  >
                    (844) 963-4740
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">Available 24/7</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full bg-card/50 border-border hover:border-purple/30 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-purple/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-purple" />
                  </div>
                  <h3 className="heading-md mb-2 text-foreground">Email Us</h3>
                  <a 
                    href="mailto:hello@odeuo.com" 
                    onClick={handleEmailClick}
                    className="text-purple hover:text-purple/80 transition-colors font-semibold"
                  >
                    hello@odeuo.com
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">Watch how fast we respond</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full bg-card/50 border-border hover:border-cyan/30 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-cyan/10 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-cyan" />
                  </div>
                  <h3 className="heading-md mb-2 text-foreground">Location</h3>
                  <p className="text-muted-foreground font-semibold">North America</p>
                  <p className="text-sm text-muted-foreground mt-2">Serving law firms nationwide</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cal.com Scheduler Section */}
      <section className="py-16">
        <div className="site-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-5xl mx-auto"
          >
            <Card className="glass-strong border-cyan/20">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center justify-center gap-3 mb-8">
                  <Calendar className="w-8 h-8 text-cyan" />
                  <h2 className="heading-lg text-foreground">Schedule a Consultation</h2>
                </div>
                
                <p className="text-center body-base text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Book a time that works for you. We'll discuss your practice's needs and show you 
                  how ODEUO AI can help you capture every opportunity.
                </p>

                {/* Cal.com Embed */}
                <div
                  className="w-full relative overflow-hidden cal-embed"
                  style={{
                    borderRadius: '8px',
                    height: '580px' // Reduced height to clip the logo
                  }}
                >
                  <iframe
                    src="https://cal.com/odeuo/30min?embed=true&theme=auto&layout=month_view&hideEventTypeDetails=false&hideBranding=true"
                    width="100%"
                    height="680"
                    frameBorder="0"
                    style={{
                      border: 'none'
                    }}
                    title="Schedule a consultation with ODEUO AI"
                  ></iframe>
                </div>

                <p className="text-sm text-muted-foreground text-center mt-8">
                  Prefer to call? Reach us at{' '}
                  <a 
                    href="tel:8449634740" 
                    onClick={handlePhoneClick}
                    className="text-cyan hover:text-cyan/80 font-semibold"
                  >
                    (844) 963-4740
                  </a>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Why Schedule Section */}
      <section className="py-16 bg-card/30">
        <div className="site-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="heading-lg text-center mb-12 text-foreground">
              What to Expect on the Call
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan to-purple flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
                  1
                </div>
                <h3 className="heading-md mb-2 text-foreground">Understand Your Needs</h3>
                <p className="body-base text-muted-foreground">
                  We'll learn about your practice, call volume, and current challenges.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan to-purple flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
                  2
                </div>
                <h3 className="heading-md mb-2 text-foreground">Live Demonstration</h3>
                <p className="body-base text-muted-foreground">
                  Experience our AI receptionist in action with a personalized demo.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan to-purple flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
                  3
                </div>
                <h3 className="heading-md mb-2 text-foreground">Custom Solution</h3>
                <p className="body-base text-muted-foreground">
                  Get a tailored plan and pricing for your specific practice needs.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16">
        <div className="site-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="glass-strong border-purple/20">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center justify-center gap-3 mb-8">
                  <MessageSquare className="w-8 h-8 text-purple" />
                  <h2 className="heading-lg text-foreground">Send Us a Message</h2>
                </div>

                <p className="text-center body-base text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Prefer to send a message? Fill out the form below and and watch how fast we get back to you.
                </p>

                {!isSubmitted ? (
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="John Smith"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@lawfirm.com"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="(555) 123-4567"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Law Firm Name</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="Smith & Associates"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your practice and how we can help..."
                        rows={4}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="flex justify-center">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="gradient-cyan-purple hover:opacity-90 transition-opacity text-lg px-8 py-6 group glow-purple"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 w-5 h-5" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan to-purple flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="heading-md mb-2 text-foreground">Message Sent!</h3>
                    <p className="body-base text-muted-foreground mb-6">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <Button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: '', email: '', phone: '', company: '', message: '' });
                      }}
                      variant="outline"
                      className="border-purple/30 hover:border-purple hover:bg-purple/10"
                    >
                      Send Another Message
                    </Button>
                  </div>
                )}

                <p className="text-sm text-muted-foreground text-center mt-8">
                  Need immediate assistance? Call us at{' '}
                  <a
                    href="tel:8449634740"
                    onClick={handlePhoneClick}
                    className="text-purple hover:text-purple/80 font-semibold"
                  >
                    (844) 963-4740
                  </a>
                </p>
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
