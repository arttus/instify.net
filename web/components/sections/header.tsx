'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, Phone } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import { useTheme } from '@/components/theme-provider';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { trackPhoneCall } from '@/components/analytics';

const navigation = [
  { name: 'Solutions', href: '#solution' },
  { name: 'How It Works', href: '#transformation' },
  { name: 'Transformations', href: '#transformation' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handlePhoneClick = () => {
    trackPhoneCall();
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If it's a route link (not starting with #), let Next.js handle it
    if (!href.startsWith('#')) {
      setIsOpen(false);
      return;
    }

    // If we're not on the home page, navigate to home page with hash
    if (pathname !== '/') {
      setIsOpen(false);
      window.location.href = '/' + href;
      return;
    }

    // We're on home page, do smooth scroll
    e.preventDefault();
    setIsOpen(false);

    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border transition-all duration-300"
    >
      <div className="site-container">
        <nav className="flex items-center justify-between h-20 relative">
          {/* Left section - Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center flex-shrink-0"
          >
            <Link href="/" className="flex-shrink-0">
              <div className="w-[150px] h-10 relative">
                <Image
                  src={theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
                  alt="ODEUO AI"
                  fill
                  sizes="150px"
                  priority
                  className="cursor-pointer object-contain object-left"
                />
              </div>
            </Link>
          </motion.div>

          {/* Center section - Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2"
          >
            {navigation.map((item) => (
              item.href.startsWith('#') ? (
                <a
                  key={item.name}
                  href={pathname === '/' ? item.href : `/${item.href}`}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-sm font-bold text-foreground/80 hover:text-cyan transition-colors relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan transition-all group-hover:w-full" />
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-bold text-foreground/80 hover:text-cyan transition-colors relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan transition-all group-hover:w-full" />
                </Link>
              )
            ))}
          </motion.div>

          {/* Right section - Desktop Phone CTA & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Desktop CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:flex items-center gap-4"
            >
        
            <ThemeToggle />
            <Button size="sm" asChild className="gradient-cyan-purple hover:opacity-90 transition-opacity group">
              <Link href="/contact">
                <Phone className="w-4 h-4 mr-2" />
                Get Started
              </Link>
            </Button>
            </motion.div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <button
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Toggle menu"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-6 mt-8">
                {navigation.map((item) => (
                  item.href.startsWith('#') ? (
                    <a
                      key={item.name}
                      href={pathname === '/' ? item.href : `/${item.href}`}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="text-lg font-bold text-foreground hover:text-cyan transition-colors"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-bold text-foreground hover:text-cyan transition-colors"
                    >
                      {item.name}
                    </Link>
                  )
                ))}
                <div className="pt-4 space-y-3 border-t border-border">
                  <a
                    href="tel:8449634740"
                    onClick={handlePhoneClick}
                    className="block text-center phone-number gradient-text-cyan"
                  >
                    (844) 963-4740
                  </a>
                  <Button size="sm" asChild className="w-full gradient-cyan-purple">
                    <Link href="/contact">
                      <Phone className="w-4 h-4 mr-2" />
                      Get Started
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
            </Sheet>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}