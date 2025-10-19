"use client";

import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function StickyCallButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          href="tel:+18449634740"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 md:hidden flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-success-green to-success-green/80 text-white rounded-full shadow-2xl shadow-success-green/50 hover:shadow-success-green/70 transition-shadow"
        >
          <Phone className="h-5 w-5 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-xs font-medium">Call Now</span>
            <span className="text-sm font-bold">(844) 963-4740</span>
          </div>
        </motion.a>
      )}
    </AnimatePresence>
  );
}