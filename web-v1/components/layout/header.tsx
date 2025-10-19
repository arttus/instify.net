"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary">ODEUO</div>
            <span className="hidden sm:inline text-sm text-muted-foreground">
              | AI Automation for Legal Firms
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("solution")}
              className="text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              Solution
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("transformation")}
              className="text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              Transformation
            </button>
            <button
              onClick={() => scrollToSection("roi")}
              className="text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              ROI Calculator
            </button>
            <Button onClick={() => scrollToSection("audit")}>
              Get Free Audit
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("solution")}
                className="text-sm font-medium text-foreground hover:text-accent transition-colors text-left"
              >
                Solution
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-sm font-medium text-foreground hover:text-accent transition-colors text-left"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("transformation")}
                className="text-sm font-medium text-foreground hover:text-accent transition-colors text-left"
              >
                Transformation
              </button>
              <button
                onClick={() => scrollToSection("roi")}
                className="text-sm font-medium text-foreground hover:text-accent transition-colors text-left"
              >
                ROI Calculator
              </button>
              <Button onClick={() => scrollToSection("audit")} className="w-full">
                Get Free Audit
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}