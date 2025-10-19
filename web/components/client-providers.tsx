'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
// import { CookieConsent } from '@/components/cookie-consent';

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  // Cookie consent handlers - commented out for US market (no GDPR requirement)
  // Can be re-enabled later when expanding to EU markets
  // const handleAccept = () => {
  //   // Analytics already loaded, just track consent
  //   if (typeof window !== 'undefined' && window.gtag) {
  //     window.gtag('consent', 'update', {
  //       analytics_storage: 'granted',
  //       ad_storage: 'denied'
  //     });
  //   }
  // };

  // const handleDecline = () => {
  //   // Disable analytics
  //   if (typeof window !== 'undefined' && window.gtag) {
  //     window.gtag('consent', 'update', {
  //       analytics_storage: 'denied',
  //       ad_storage: 'denied'
  //     });
  //   }
  // };

  return (
    <ThemeProvider>
      {children}
      {/* Cookie consent banner - commented out for US market */}
      {/* <CookieConsent onAccept={handleAccept} onDecline={handleDecline} /> */}
    </ThemeProvider>
  );
}
