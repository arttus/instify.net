import Script from 'next/script'

interface StructuredDataProps {
  data: Record<string, any>
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Organization Schema
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ODEUO AI",
  "description": "AI automation platform transforming law practices through intelligent 24/7 voice reception and practice management solutions.",
  "url": "https://odeuo.com",
  "logo": "https://odeuo.com/logo-light.png",
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+1-844-963-4740",
      "contactType": "customer service",
      "availableLanguage": "English",
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    },
    {
      "@type": "ContactPoint",
      "email": "hello@odeuo.com",
      "contactType": "customer service",
      "availableLanguage": "English"
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "North America",
    "addressCountry": "US"
  },
  "sameAs": [
    "https://linkedin.com/company/odeuo-ai",
    "https://twitter.com/odeuo_ai"
  ]
}

// Legal Service Schema
export const legalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "AI Receptionist for Law Firms",
  "description": "24/7 AI-powered receptionist service specifically designed for law firms. Never miss another client call with intelligent automation that works alongside your team.",
  "provider": {
    "@type": "Organization",
    "name": "ODEUO AI",
    "url": "https://odeuo.com"
  },
  "serviceType": "Legal Practice Automation",
  "areaServed": {
    "@type": "Place",
    "name": "North America"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "AI Legal Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "24/7 AI Voice Receptionist",
          "description": "Intelligent AI receptionist that handles calls, books appointments, and captures leads 24/7"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Practice Transformation Consultation",
          "description": "Strategic consultation to transform your law practice with AI automation"
        }
      }
    ]
  },
  "audience": {
    "@type": "Audience",
    "audienceType": "Law Firms"
  }
}

// Website Schema
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ODEUO AI",
  "description": "Transform your law practice with 24/7 AI receptionist and automation solutions",
  "url": "https://odeuo.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://odeuo.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "ODEUO AI",
    "logo": "https://odeuo.com/logo-light.png"
  }
}

// FAQ Schema (for common questions)
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does the AI receptionist work for law firms?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our AI receptionist provides 24/7 phone coverage for law firms, handling client calls, booking consultations, and capturing leads. It works alongside your existing team to ensure no calls are missed during after-hours, busy periods, or vacations."
      }
    },
    {
      "@type": "Question",
      "name": "Is the AI receptionist compliant with legal industry requirements?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, our AI receptionist is designed specifically for law firms and is HIPAA-ready and Bar Association compliant. It never gives legal advice and maintains proper ethical boundaries while providing professional client service."
      }
    },
    {
      "@type": "Question",
      "name": "How quickly can the AI receptionist be implemented?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Implementation typically takes 7-14 days. We provide a complete setup process that integrates with your existing phone system and practice management tools."
      }
    },
    {
      "@type": "Question",
      "name": "What is the cost of the AI receptionist service?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Pricing varies based on your firm's specific needs and call volume. Contact us at (844) 963-4740 for a custom quote and ROI projection for your practice."
      }
    }
  ]
}

// Breadcrumb Schema
export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
})

// Article Schema (for blog posts if added later)
export const createArticleSchema = (article: {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
  author: string
  image?: string
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "url": article.url,
  "datePublished": article.datePublished,
  "dateModified": article.dateModified || article.datePublished,
  "author": {
    "@type": "Organization",
    "name": article.author
  },
  "publisher": {
    "@type": "Organization",
    "name": "ODEUO AI",
    "logo": "https://odeuo.com/logo-light.png"
  },
  "image": article.image || "https://odeuo.com/og-image.jpg"
})
