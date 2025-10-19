'use client';

import { Separator } from '@/components/ui/separator';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="bg-card/30 border-t border-border">
      <div className="site-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <Link href="/">
              <Image
                src={theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
                alt="ODEUO AI"
                width={150}
                height={40}
                className="h-10 w-auto mb-4 cursor-pointer"
              />
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Transforming law practices through intelligent AI automation, starting with 24/7 voice reception.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="tel:8449634740" className="flex items-center gap-2 hover:text-cyan transition-colors">
                <Phone className="w-4 h-4" />
                <span className="font-semibold text-cyan">(844) 963-4740</span>
              </a>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@odeuo.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>North America</span>
              </div>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Solutions</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#solution" className="hover:text-cyan transition-colors">AI Voice Receptionist</Link></li>
              <li><Link href="/#transformation" className="hover:text-cyan transition-colors">Transformation Approach</Link></li>
              <li><a href="#" className="hover:text-cyan transition-colors">Practice Areas</a></li>
              <li><Link href="/roi-calculator" className="hover:text-cyan transition-colors">ROI Calculator</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-cyan transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-cyan transition-colors">Legal AI Guide</a></li>
              <li><a href="#" className="hover:text-cyan transition-colors">FAQ</a></li>
              <li><Link href="/blog" className="hover:text-cyan transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-cyan transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-cyan transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-cyan transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-cyan transition-colors">Partners</a></li>
            </ul>
          </div>
        </div>
 {/* Compliance Badges */}
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 pt-4 border-t border-border/30">
            <div className="flex gap-6 text-xs">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                HIPAA-Ready
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Bar Association Compliant
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                SOC 2 Ready
              </span>
            </div>
            <p className="text-xs">Professional AI solutions for legal practices</p>
          </div>
        <Separator className="my-8 bg-border" />

        <div className="flex flex-col gap-4 text-sm text-muted-foreground">
          {/* Legal Links */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2025 ODEUO AI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-cyan transition-colors font-medium">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-cyan transition-colors font-medium">
                Terms of Service
              </Link>
            </div>
          </div>

         
        </div>
      </div>
    </footer>
  );
}