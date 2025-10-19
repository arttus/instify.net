import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics";
import { ClientProviders } from "@/components/client-providers";
import { StructuredData, organizationSchema, legalServiceSchema, websiteSchema, faqSchema } from "@/components/structured-data";
import { generateMetadata, seoPages } from "@/lib/seo";

export const metadata: Metadata = generateMetadata(seoPages.home);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData data={organizationSchema} />
        <StructuredData data={legalServiceSchema} />
        <StructuredData data={websiteSchema} />
        <StructuredData data={faqSchema} />
      </head>
      <body className="antialiased">
        <GoogleAnalytics />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}