# AI Automation Agency Website Fullstack Architecture Document

## Introduction

This document outlines the complete fullstack architecture for AI Automation Agency Website, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for modern fullstack applications where these concerns are increasingly intertwined.

### Starter Template or Existing Project

Based on the PRD technical assumptions, this is a **greenfield Next.js 15 project** with specific technology choices already defined:

- **Framework:** Next.js 15+ with App Router and TypeScript
- **Styling:** Tailwind CSS with shadcn/ui components
- **Hosting:** Vercel platform for deployment and edge optimization
- **No existing starter template** - custom implementation leveraging modern Next.js patterns

**Recommended Approach:** Build from Next.js 15 foundation using `create-next-app` with TypeScript template, then integrate shadcn/ui, Tailwind CSS, and other specified dependencies. This provides maximum flexibility for the premium glassmorphism aesthetic and interactive components while maintaining performance targets.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|---------|
| 2025-01-20 | 1.0 | Initial architecture design from PRD | Architect Agent |

## High Level Architecture

### Technical Summary

The AI Automation Agency Website employs a modern **JAMstack architecture** built on Next.js 15 with App Router, deployed on Vercel's edge network for optimal global performance. The frontend leverages **Static Site Generation (SSG)** with **Incremental Static Regeneration (ISR)** for dynamic content updates, while interactive components like the ROI calculator utilize **client-side React** with server-side API routes for form processing. The architecture integrates **third-party services** (SendGrid for email, Cal.ai for scheduling, Google Analytics for tracking) through serverless functions, ensuring scalability while maintaining the sub-3-second load times required for lead conversion optimization. This approach achieves the PRD's Lighthouse 90+ performance targets while supporting the premium glassmorphism aesthetic and smooth Framer Motion animations.

### Platform and Infrastructure Choice

**Platform:** Vercel Edge Network  
**Key Services:** Next.js App Router, Vercel Functions, Vercel Analytics, Edge Config  
**Deployment Host and Regions:** Global edge deployment with primary regions in US-East, US-West, EU-West

**Recommendation: Vercel + Next.js Native**

Given the PRD requirements for a marketing website with lead capture, Vercel provides the optimal balance of performance, simplicity, and development velocity. The serverless architecture aligns perfectly with the 6-week timeline and performance targets.

### Repository Structure

**Monorepo Approach:** Single repository with clear separation of concerns using Next.js 15 App Router structure

```
ai-automation-website/
├── app/                          # Next.js App Router pages and layouts
│   ├── (marketing)/             # Route groups for marketing pages
│   │   ├── page.tsx            # Landing page
│   │   ├── speed-to-lead/      # Service pages
│   │   ├── lead-qualification/
│   │   ├── social-media-automation/
│   │   └── sms-appointment-setter/
│   ├── api/                    # API routes for form handling
│   ├── globals.css             # Global styles and Tailwind imports
│   └── layout.tsx              # Root layout with theme provider
├── components/                  # Reusable UI components
│   ├── ui/                     # shadcn/ui base components
│   ├── forms/                  # Form components with validation
│   ├── sections/               # Page section components
│   └── interactive/            # ROI calculator and animations
├── lib/                        # Utility functions and configurations
│   ├── utils.ts               # General utilities
│   ├── validations.ts         # Zod schemas
│   └── integrations/          # Third-party service clients
├── public/                     # Static assets
├── styles/                     # Additional CSS files
└── types/                      # TypeScript type definitions
```

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Vercel Edge Network                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │   Static Pages  │    │  API Routes     │    │  Edge Config │ │
│  │   (SSG/ISR)     │    │  (Serverless)   │    │  (Runtime)   │ │
│  └─────────────────┘    └─────────────────┘    └──────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
            ┌───────▼────┐ ┌────▼────┐ ┌───▼────────┐
            │  SendGrid  │ │ Cal.ai  │ │Google      │
            │  (Email)   │ │(Booking)│ │Analytics   │
            └────────────┘ └─────────┘ └────────────┘
```

## Frontend Architecture

### Component Architecture

**Design System Foundation:**
- **Base Layer:** shadcn/ui components built on Radix UI primitives for accessibility and customization
- **Theme Layer:** CSS variables with next-themes for dark/light mode switching
- **Style Layer:** Tailwind CSS with custom configuration for glassmorphism effects and brand colors
- **Animation Layer:** Framer Motion for smooth transitions and micro-interactions

**Component Hierarchy:**
```
Layout Components
├── RootLayout (theme provider, global styles)
├── Header (navigation, theme toggle, mobile menu)
├── Footer (links, contact info, legal)
└── PageLayout (consistent spacing, SEO meta)

UI Components (shadcn/ui based)
├── Button (variants: primary, secondary, ghost)
├── Card (service cards, testimonial cards)
├── Form (input, textarea, select with validation)
├── Dialog (modals, mobile menu overlay)
└── Accordion (FAQ sections)

Interactive Components
├── ROICalculator (multi-step form with results)
├── AnimatedCounter (hero statistics)
├── ServiceCard (hover effects, navigation)
├── TestimonialCarousel (rotating social proof)
└── ContactForm (validation, submission states)

Section Components
├── HeroSection (headline, CTA, animated stats)
├── ServicesOverview (four service cards grid)
├── SocialProof (testimonials, case studies)
├── FAQ (accordion with smooth animations)
└── CallToAction (lead capture, calendar booking)
```

### State Management Strategy

**Client-Side State:**
- **Theme State:** next-themes for dark/light mode persistence
- **Form State:** React Hook Form for complex forms with Zod validation
- **UI State:** React useState for component-level interactions (modals, accordions)
- **Calculator State:** Custom hook for ROI calculator logic and results

**Server State:**
- **Form Submissions:** Direct API calls with loading/success/error states
- **Static Content:** Pre-rendered at build time, no client-side fetching needed
- **Analytics:** Event tracking through Google Analytics 4 and Facebook Pixel

**No Global State Management:** Given the marketing website nature, complex state management (Redux, Zustand) is unnecessary. Component-level state and form libraries provide sufficient functionality.

### Responsive Design System

**Breakpoint Strategy:**
```typescript
// Tailwind CSS breakpoints
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet portrait
  lg: '1024px',  // Tablet landscape / Small desktop
  xl: '1280px',  // Desktop
  '2xl': '1536px' // Large desktop
}
```

**Mobile-First Implementation:**
- **Base Styles:** Optimized for 320px-640px mobile devices
- **Progressive Enhancement:** Additional features and layouts for larger screens
- **Touch Targets:** Minimum 44px touch targets for mobile interactions
- **Navigation:** Hamburger menu below 768px, full navigation above

### Performance Optimization Architecture

**Core Web Vitals Strategy:**

**Largest Contentful Paint (LCP) < 2.5s:**
- Hero section optimized with critical CSS inlining
- Above-fold images preloaded with Next.js Image priority
- Font optimization with next/font for zero layout shift

**First Input Delay (FID) < 100ms:**
- Minimal JavaScript on initial page load
- Interactive components lazy-loaded below the fold
- Event handlers optimized with debouncing and throttling

**Cumulative Layout Shift (CLS) < 0.1:**
- Fixed dimensions for all images and media
- Skeleton loading states for dynamic content
- CSS containment for animation boundaries

## Backend Architecture

### API Design and Structure

**Next.js App Router API Routes:**
```
app/api/
├── contact/
│   └── route.ts              # General contact form submission
├── calculator/
│   └── route.ts              # ROI calculator results and lead capture
├── services/
│   ├── speed-to-lead/
│   │   └── route.ts          # Speed to Lead service inquiry
│   ├── lead-qualification/
│   │   └── route.ts          # Lead Qualification service inquiry
│   ├── social-media/
│   │   └── route.ts          # Social Media Automation inquiry
│   └── sms-appointment/
│       └── route.ts          # SMS Appointment Setter inquiry
├── newsletter/
│   └── route.ts              # Newsletter subscription
└── webhooks/
    ├── cal-ai/
    │   └── route.ts          # Cal.ai webhook for appointment tracking
    └── sendgrid/
        └── route.ts          # Email delivery status webhooks
```

### Data Models and Validation

**Zod Validation Schemas:**
```typescript
// Contact form schema
const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number"),
  company: z.string().min(2, "Company name required"),
  serviceInterest: z.enum([
    "speed-to-lead",
    "lead-qualification", 
    "social-media-automation",
    "sms-appointment-setter",
    "multiple-services"
  ]),
  message: z.string().max(1000, "Message too long"),
  consent: z.boolean().refine(val => val === true, "Consent required")
});

// ROI Calculator schema
const ROICalculatorSchema = z.object({
  monthlyLeads: z.number().min(1).max(10000),
  averageJobValue: z.number().min(100).max(100000),
  currentResponseTime: z.number().min(1).max(1440), // minutes
  industry: z.enum(["hvac", "dental", "legal", "plumbing", "roofing", "other"]),
  businessSize: z.enum(["solo", "small", "medium", "large"])
});
```

### Third-Party Integrations

**Cal.ai Integration Service:**
```typescript
class CalAIService {
  async createBookingLink(leadData: LeadData): Promise<string> {
    const bookingData = {
      eventTypeId: process.env.CAL_AI_EVENT_TYPE_ID,
      prefill: {
        name: leadData.name,
        email: leadData.email,
        customInputs: {
          company: leadData.company,
          serviceInterest: leadData.serviceInterest,
          calculatorResults: leadData.calculatorResults ? JSON.stringify(leadData.calculatorResults) : null
        }
      }
    };
    
    const response = await fetch(`${this.baseUrl}/v1/booking-links`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });
    
    const result = await response.json();
    return result.bookingUrl;
  }
}
```

## Database and Content Management

### Content Management Strategy

**Static-First Approach with Dynamic Capabilities:**

**Static Content (Build-Time):**
```
content/
├── pages/
│   ├── home.json                 # Landing page content
│   ├── speed-to-lead.json       # Service page content
│   ├── lead-qualification.json
│   ├── social-media-automation.json
│   └── sms-appointment-setter.json
├── testimonials/
│   ├── testimonials.json        # Client testimonials and ratings
│   └── case-studies.json        # Success stories and metrics
├── faqs/
│   └── faqs.json               # Frequently asked questions
└── settings/
    ├── site-config.json        # Global site configuration
    └── calculator-config.json  # ROI calculator parameters
```

**Dynamic Content (Runtime):**
- Form submissions and lead data
- Analytics and tracking data
- User preferences (theme, calculator inputs)
- Real-time availability from Cal.ai

### Lead Data Management

**Serverless Data Persistence:**
```typescript
class VercelKVLeadStorage implements LeadStorage {
  async storeLead(lead: LeadData): Promise<string> {
    const leadId = generateLeadId();
    const leadWithId = { ...lead, id: leadId, createdAt: new Date().toISOString() };
    
    // Store in Vercel KV for quick access
    await this.kv.set(`lead:${leadId}`, leadWithId);
    
    // Also store in time-based index for reporting
    const dateKey = format(new Date(), 'yyyy-MM-dd');
    await this.kv.sadd(`leads:${dateKey}`, leadId);
    
    return leadId;
  }
}
```

## Development Guidelines and Standards

### Code Organization and Structure

**File Naming Conventions:**
```
Components: PascalCase (e.g., ROICalculator.tsx, ServiceCard.tsx)
Pages: kebab-case (e.g., speed-to-lead/page.tsx)
Utilities: camelCase (e.g., formatCurrency.ts, validateEmail.ts)
Types: PascalCase with .types.ts suffix (e.g., Lead.types.ts)
Constants: SCREAMING_SNAKE_CASE (e.g., API_ENDPOINTS.ts)
Hooks: camelCase with use prefix (e.g., useROICalculator.ts)
```

### TypeScript Standards

**Type Definitions:**
```typescript
export interface LeadData {
  readonly id?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceInterest: ServiceType;
  message?: string;
  calculatorResults?: ROIResults;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export type ServiceType = 
  | 'speed-to-lead'
  | 'lead-qualification'
  | 'social-media-automation'
  | 'sms-appointment-setter'
  | 'multiple-services';
```

### Performance Standards

**Core Web Vitals Compliance:**
```typescript
export const PERFORMANCE_THRESHOLDS = {
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100,  // First Input Delay (ms)
  CLS: 0.1,  // Cumulative Layout Shift
  TTFB: 800, // Time to First Byte (ms)
} as const;
```

## Deployment and DevOps

### CI/CD Pipeline Architecture

**GitHub Actions Workflow:**
- Quality checks (TypeScript, linting, testing)
- Lighthouse CI performance validation
- Preview deployments for pull requests
- Production deployment on main branch merge
- Post-deployment health checks

### Environment Configuration

**Environment Management Strategy:**
```typescript
const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  SENDGRID_API_KEY: z.string(),
  CAL_AI_API_KEY: z.string(),
  NEXT_PUBLIC_GA4_MEASUREMENT_ID: z.string(),
  VERCEL_KV_REST_API_URL: z.string().url().optional(),
});

export const env = environmentSchema.parse(process.env);
```

### Monitoring and Observability

**Health Check Endpoint:**
- Service dependency checks (email, calendar, analytics)
- Performance metrics monitoring
- Error tracking and alerting
- Real User Monitoring (RUM) for Core Web Vitals

## Appendices and References

### Architecture Decision Records (ADRs)

**ADR-001: Next.js 15 with App Router** - Accepted for modern React patterns and performance
**ADR-002: Vercel Hosting Platform** - Accepted for Next.js integration and edge optimization
**ADR-003: Cal.ai over Calendly** - Accepted for API-first approach and customization
**ADR-004: Static-First Content Management** - Accepted for performance and simplicity
**ADR-005: Serverless Architecture** - Accepted for automatic scaling and reduced complexity

### Technology Stack Summary

**Frontend:** Next.js 15+ with TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
**Backend:** Next.js API routes, Zod validation, SendGrid, Cal.ai
**Infrastructure:** Vercel Edge Network, Vercel Functions, Vercel KV
**Development:** ESLint, Prettier, Jest, Lighthouse CI, GitHub Actions

### Performance Benchmarks and Targets

**Core Web Vitals Targets:**
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1
- Lighthouse Scores: 90+ across all categories

---

### Security Considerations

**Data Protection:**
- HTTPS enforcement with security headers
- Input validation and sanitization on all forms
- Rate limiting on API endpoints (5 requests/hour/IP)
- GDPR-compliant data collection with consent management
- Secure environment variable management

**API Security:**
- CORS configuration for API endpoints
- Webhook signature verification for Cal.ai and SendGrid
- Request size limits and timeout configurations
- Error handling that doesn't expose sensitive information

### Scalability Considerations

**Traffic Scaling:**
- Vercel Edge Network for global content delivery
- Automatic serverless function scaling
- Static asset optimization and caching
- Database-free architecture for unlimited read scaling

**Content Scaling:**
- Modular content structure for easy expansion
- Component-based architecture for feature additions
- API-first design for future integrations
- Headless architecture ready for multi-channel expansion

### Cost Analysis and Optimization

**Estimated Monthly Costs (Production):**
```
Vercel Pro Plan: $20/month
SendGrid Essentials: $15/month
Cal.ai Pro: $12/month
Domain and SSL: $1.25/month
Total Estimated: ~$48/month
```

**Cost Optimization Strategies:**
- Static-first architecture minimizes function execution costs
- Efficient caching reduces bandwidth usage
- Optimized images and assets reduce storage costs
- Monitoring prevents over-provisioning of resources

---

## Architecture Complete

This comprehensive architecture document provides complete technical specifications for implementing the AI Automation Agency Website according to PRD requirements. The architecture ensures optimal performance, scalability, and maintainability while meeting the 6-week development timeline.

**Ready for Implementation Phase**
