import { Metadata } from 'next'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string
  canonical?: string
  noindex?: boolean
  nofollow?: boolean
  openGraph?: {
    title?: string
    description?: string
    type?: 'website' | 'article' | 'profile'
    images?: Array<{
      url: string
      width?: number
      height?: number
      alt?: string
    }>
  }
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player'
    title?: string
    description?: string
    images?: string[]
  }
}

const defaultSEO: SEOConfig = {
  title: 'ODEUO AI - Transform Your Law Practice | 24/7 AI Receptionist',
  description: 'Never lose another client to a missed call. Call (844) 963-4740 to try our AI receptionist live. 24/7 coverage, instant response, professional service for law firms.',
  keywords: 'AI receptionist for law firms, legal practice automation, 24/7 legal answering service, law firm AI, legal AI automation, attorney answering service, legal practice management, client intake automation, law firm technology, legal receptionist AI',
  canonical: 'https://odeuo.com',
  openGraph: {
    type: 'website',
    images: [
      {
        url: 'https://odeuo.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ODEUO AI - 24/7 AI Receptionist for Law Firms'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image'
  }
}

export function generateMetadata(config: Partial<SEOConfig> = {}): Metadata {
  const seo = { ...defaultSEO, ...config }
  
  const metadata: Metadata = {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: 'ODEUO AI' }],
    creator: 'ODEUO AI',
    publisher: 'ODEUO AI',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://odeuo.com'),
    alternates: {
      canonical: seo.canonical,
    },
    openGraph: {
      title: seo.openGraph?.title || seo.title,
      description: seo.openGraph?.description || seo.description,
      type: seo.openGraph?.type || 'website',
      locale: 'en_US',
      url: seo.canonical,
      siteName: 'ODEUO AI',
      images: seo.openGraph?.images || defaultSEO.openGraph?.images,
    },
    twitter: {
      card: seo.twitter?.card || 'summary_large_image',
      title: seo.twitter?.title || seo.title,
      description: seo.twitter?.description || seo.description,
      images: seo.twitter?.images || seo.openGraph?.images?.map(img => img.url),
      creator: '@odeuo_ai',
      site: '@odeuo_ai',
    },
    robots: {
      index: !seo.noindex,
      follow: !seo.nofollow,
      googleBot: {
        index: !seo.noindex,
        follow: !seo.nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code', // Replace with actual verification code
    },
  }

  return metadata
}

export const seoPages = {
  home: {
    title: 'ODEUO AI - Transform Your Law Practice | 24/7 AI Receptionist',
    description: 'Never lose another client to a missed call. Call (844) 963-4740 to try our AI receptionist live. 24/7 coverage, instant response, professional service for law firms.',
    canonical: 'https://odeuo.com',
  },
  contact: {
    title: 'Contact ODEUO AI - Schedule Your AI Receptionist Demo',
    description: 'Ready to transform your law practice? Contact ODEUO AI to schedule a live demo of our 24/7 AI receptionist. Call (844) 963-4740 or book a consultation online.',
    canonical: 'https://odeuo.com/contact',
  },
  privacy: {
    title: 'Privacy Policy - ODEUO AI Legal Practice Automation',
    description: 'Learn how ODEUO AI protects your law firm\'s data and client information. Our privacy policy covers data collection, usage, and security measures for legal AI services.',
    canonical: 'https://odeuo.com/privacy',
    noindex: false,
  },
  terms: {
    title: 'Terms of Service - ODEUO AI Legal AI Platform',
    description: 'Terms of service for ODEUO AI\'s legal practice automation platform. Review our service terms, usage policies, and legal agreements for AI receptionist services.',
    canonical: 'https://odeuo.com/terms',
    noindex: false,
  },

  roiCalculator: {
    title: 'ROI Calculator - Calculate Your AI Receptionist Return | ODEUO AI',
    description: 'Calculate the exact ROI of implementing ODEUO AI\'s 24/7 receptionist for your law practice. See potential revenue increase, cost savings, and payback period.',
    keywords: [...defaultSEO.keywords, 'ROI calculator', 'law firm ROI', 'AI receptionist ROI', 'legal practice calculator', 'cost savings calculator', 'revenue calculator', 'law firm investment', 'practice automation ROI'],
    canonical: 'https://odeuo.com/roi-calculator',
    noindex: false,
  },
}
