import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ODUEO - Navigate to the Future of Legal Practice",
  description: "AI automation that transforms hours of manual work into minutes. Built specifically for legal firms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}