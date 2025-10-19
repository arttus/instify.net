import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="gradient-intelligence text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <Image
              src="/logo.png"
              alt="ODUEO"
              width={120}
              height={40}
              className="h-10 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-sm text-white/60 mb-4">
              Navigate to the future of legal practice
            </p>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Document Automation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Client Communication</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Legal Research</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Practice Management</a></li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="font-semibold mb-4">Industries</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Personal Injury</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Family Law</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Estate Planning</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Business Law</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm text-white/60 mb-3">Get legal AI insights delivered to your inbox</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
              <Button size="sm" className="bg-white text-intelligence-blue hover:bg-white/90">
                →
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <p>© 2025 ODUEO. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}