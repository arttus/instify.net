"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

export function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold mb-4">ODEUO</div>
            <p className="text-sm text-primary-foreground/80 mb-4 max-w-md">
              AI automation agency specializing in legal firms. Transform your
              practice with intelligent automation that works alongside your
              team.
            </p>
            <p className="text-xs text-primary-foreground/60 italic">
              From the Greek ὁδεύω (hodeuō) — "to journey, to guide the way"
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection("solution")}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  AI Voice Receptionist
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("transformation")}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Transformation Approach
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("roi")}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  ROI Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>brand@odeuo.com</li>
              <li>partnerships@odeuo.com</li>
              <li>compliance@odeuo.com</li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-primary-foreground/60">
          <p>© 2025 ODEUO. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="hover:text-primary-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}