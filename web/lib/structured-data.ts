import { BlogPost, BlogPostMeta } from './blog';

// Organization schema for ODEUO AI
const organizationSchema = {
  "@type": "Organization",
  "@id": "https://odeuo.com/#organization",
  "name": "ODEUO AI",
  "url": "https://odeuo.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://odeuo.com/logo-light.png",
    "width": 512,
    "height": 512
  },
  "description": "AI-powered legal receptionist and client intake solutions for law firms",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-844-963-4740",
    "contactType": "customer service",
    "availableLanguage": "English"
  },
  "sameAs": [
    "https://linkedin.com/company/odeuo-ai",
    "https://twitter.com/odeuo_ai"
  ]
};

// Website schema
const websiteSchema = {
  "@type": "WebSite",
  "@id": "https://odeuo.com/#website",
  "url": "https://odeuo.com",
  "name": "ODEUO AI",
  "description": "AI-powered legal receptionist and client intake solutions for law firms",
  "publisher": {
    "@id": "https://odeuo.com/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://odeuo.com/blog?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// Author schema for blog posts
const authorSchema = {
  "@type": "Person",
  "@id": "https://odeuo.com/#author",
  "name": "ODEUO Team",
  "description": "Expert team specializing in AI solutions for legal practices",
  "worksFor": {
    "@id": "https://odeuo.com/#organization"
  }
};

export function generateBlogPostStructuredData(post: BlogPost) {
  const baseUrl = "https://odeuo.com";
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  
  // Calculate word count for more accurate reading time
  const wordCount = post.content.split(/\s+/).length;
  const readingTimeMinutes = Math.ceil(wordCount / 200); // Average reading speed

  const articleSchema = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
      websiteSchema,
      authorSchema,
      {
        "@type": "Article",
        "@id": `${postUrl}#article`,
        "isPartOf": {
          "@id": `${baseUrl}/blog/#webpage`
        },
        "author": {
          "@id": "https://odeuo.com/#author"
        },
        "headline": post.title,
        "description": post.description,
        "datePublished": post.date || new Date().toISOString(),
        "dateModified": post.date || new Date().toISOString(),
        "mainEntityOfPage": {
          "@id": postUrl
        },
        "publisher": {
          "@id": "https://odeuo.com/#organization"
        },
        "image": {
          "@type": "ImageObject",
          "url": `${baseUrl}/blog-images/${post.slug}-cover.jpg`,
          "width": 1200,
          "height": 630
        },
        "articleSection": post.category,
        "keywords": post.tags.join(", "),
        "wordCount": wordCount,
        "timeRequired": `PT${readingTimeMinutes}M`,
        "inLanguage": "en-US",
        "about": {
          "@type": "Thing",
          "name": "Legal AI Technology",
          "description": "AI-powered solutions for law firms and legal practices"
        },
        "mentions": [
          {
            "@type": "SoftwareApplication",
            "name": "ODEUO AI",
            "applicationCategory": "Legal Technology",
            "description": "AI-powered legal receptionist and client intake solution"
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": postUrl,
        "url": postUrl,
        "name": post.title,
        "isPartOf": {
          "@id": "https://odeuo.com/#website"
        },
        "about": {
          "@id": `${postUrl}#article`
        },
        "description": post.description,
        "breadcrumb": {
          "@id": `${postUrl}#breadcrumb`
        },
        "datePublished": post.date || new Date().toISOString(),
        "dateModified": post.date || new Date().toISOString(),
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": [postUrl]
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${postUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": `${baseUrl}/blog`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": postUrl
          }
        ]
      }
    ]
  };

  return articleSchema;
}

export function generateBlogIndexStructuredData(posts: BlogPostMeta[]) {
  const baseUrl = "https://odeuo.com";
  const blogUrl = `${baseUrl}/blog`;

  const blogSchema = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
      websiteSchema,
      {
        "@type": "Blog",
        "@id": `${blogUrl}#blog`,
        "mainEntityOfPage": {
          "@id": blogUrl
        },
        "name": "ODEUO AI Blog",
        "description": "Expert insights on AI for law firms, legal practice automation, and maximizing client capture",
        "publisher": {
          "@id": "https://odeuo.com/#organization"
        },
        "url": blogUrl,
        "inLanguage": "en-US",
        "blogPost": posts.slice(0, 10).map(post => ({
          "@type": "BlogPosting",
          "@id": `${baseUrl}/blog/${post.slug}#article`,
          "headline": post.title,
          "description": post.description,
          "url": `${baseUrl}/blog/${post.slug}`,
          "datePublished": post.date || new Date().toISOString(),
          "dateModified": post.date || new Date().toISOString(),
          "author": {
            "@id": "https://odeuo.com/#author"
          },
          "publisher": {
            "@id": "https://odeuo.com/#organization"
          },
          "image": {
            "@type": "ImageObject",
            "url": `${baseUrl}/blog-images/${post.slug}-cover.jpg`,
            "width": 1200,
            "height": 630
          },
          "articleSection": post.category,
          "keywords": post.tags.join(", ")
        }))
      },
      {
        "@type": "WebPage",
        "@id": blogUrl,
        "url": blogUrl,
        "name": "Blog - ODEUO AI | Legal AI Insights & Best Practices",
        "isPartOf": {
          "@id": "https://odeuo.com/#website"
        },
        "about": {
          "@id": `${blogUrl}#blog`
        },
        "description": "Expert insights on AI for law firms, legal practice automation, and maximizing client capture",
        "breadcrumb": {
          "@id": `${blogUrl}#breadcrumb`
        },
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": [blogUrl]
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${blogUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": blogUrl
          }
        ]
      }
    ]
  };

  return blogSchema;
}

export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

export function generateServiceStructuredData() {
  const baseUrl = "https://odeuo.com";
  
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "AI Legal Receptionist",
    "description": "24/7 AI-powered receptionist and client intake solution specifically designed for law firms",
    "provider": {
      "@id": "https://odeuo.com/#organization"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Law Firms"
    },
    "serviceType": "Legal Technology",
    "category": "AI Reception Services",
    "offers": {
      "@type": "Offer",
      "description": "AI-powered legal receptionist service with 24/7 availability",
      "url": `${baseUrl}/contact`
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "AI Legal Reception Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "24/7 AI Reception",
            "description": "Round-the-clock AI-powered phone coverage for law firms"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Intelligent Client Intake",
            "description": "AI-powered client screening and qualification system"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Appointment Scheduling",
            "description": "Automated consultation booking and calendar management"
          }
        }
      ]
    }
  };
}
