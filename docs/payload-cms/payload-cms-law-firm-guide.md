# Payload CMS Setup Guide for Law Firm Client Websites

## Overview

This guide shows you how to set up Payload CMS for your law firm clients. Payload is:
- **100% Open Source** (MIT License) - No backend costs per client
- **Next.js Native** - Installs directly in your existing Next.js app
- **Self-Hosted** - You control everything
- **TypeScript First** - Type-safe content modeling
- **Professional Admin UI** - Non-technical attorneys can edit easily

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Law Firm Collections Setup](#law-firm-collections-setup)
4. [Database Options](#database-options)
5. [Deployment Strategy](#deployment-strategy)
6. [AI Integration](#ai-integration)
7. [Client Customization](#client-customization)

---

## Quick Start

### Prerequisites

```bash
# Required software
Node.js 18.20.0+
pnpm (recommended) or npm
Next.js 15+
```

### Option 1: Start Fresh with Template

```bash
# Create new project with Payload website template
pnpx create-payload-app@latest my-law-firm-site -t website

# This gives you:
# - Next.js 15 app
# - Payload CMS pre-configured
# - Tailwind CSS
# - Example collections
# - Admin UI at /admin
```

### Option 2: Add to Existing Next.js Project

```bash
# Install Payload packages
pnpm add payload @payloadcms/next @payloadcms/richtext-lexical sharp

# Install database adapter (choose one)
pnpm add @payloadcms/db-postgres  # PostgreSQL
# OR
pnpm add @payloadcms/db-mongodb   # MongoDB
```

---

## Project Structure

```
law-firm-site/
├── app/
│   ├── (app)/                    # Frontend routes
│   │   ├── page.tsx              # Homepage
│   │   ├── attorneys/            # Attorney directory
│   │   ├── practice-areas/       # Practice area pages
│   │   └── contact/              # Contact page
│   │
│   ├── (payload)/                # Payload admin (auto-generated)
│   │   ├── admin/                # Admin UI
│   │   └── api/                  # Payload API routes
│   │
│   └── layout.tsx                # Root layout
│
├── collections/                   # Content models
│   ├── Attorneys.ts
│   ├── PracticeAreas.ts
│   ├── CaseStudies.ts
│   ├── Faqs.ts
│   └── Users.ts
│
├── payload.config.ts             # Payload configuration
├── next.config.js                # Next.js config with Payload
└── .env                          # Environment variables
```

---

## Law Firm Collections Setup

### 1. Create Collections Directory

```bash
mkdir -p collections
```

### 2. Attorney Collection

```typescript
// collections/Attorneys.ts
import { CollectionConfig } from 'payload'

export const Attorneys: CollectionConfig = {
  slug: 'attorneys',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'practiceAreas', 'status'],
  },
  access: {
    read: () => true, // Public can read
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version (e.g., john-smith)',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g., "Managing Partner" or "Senior Associate"',
      },
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'bio',
      type: 'richText',
      required: true,
    },
    {
      name: 'practiceAreas',
      type: 'relationship',
      relationTo: 'practice-areas',
      hasMany: true,
      required: true,
    },
    {
      name: 'barAdmissions',
      type: 'array',
      fields: [
        {
          name: 'state',
          type: 'text',
          required: true,
        },
        {
          name: 'year',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'education',
      type: 'array',
      fields: [
        {
          name: 'degree',
          type: 'text',
          required: true,
        },
        {
          name: 'school',
          type: 'text',
          required: true,
        },
        {
          name: 'year',
          type: 'number',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
  ],
}
```

### 3. Practice Areas Collection

```typescript
// collections/PracticeAreas.ts
import { CollectionConfig } from 'payload'

export const PracticeAreas: CollectionConfig = {
  slug: 'practice-areas',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'fullContent',
      type: 'richText',
      required: true,
      admin: {
        description: 'Full page content for practice area detail page',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'faqs',
      type: 'array',
      label: 'Frequently Asked Questions',
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
        },
      ],
      admin: {
        description: 'These FAQs will be available to your AI receptionist',
      },
    },
    {
      name: 'intakeQuestions',
      type: 'array',
      label: 'Client Intake Questions',
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'fieldType',
          type: 'select',
          required: true,
          options: [
            { label: 'Text Input', value: 'text' },
            { label: 'Long Text', value: 'textarea' },
            { label: 'Yes/No', value: 'boolean' },
            { label: 'Date', value: 'date' },
            { label: 'Multiple Choice', value: 'select' },
          ],
        },
        {
          name: 'required',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
}
```

### 4. Case Studies Collection

```typescript
// collections/CaseStudies.ts
import { CollectionConfig } from 'payload'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g., "Personal Injury Settlement - $2.5M Verdict"',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'practiceArea',
      type: 'relationship',
      relationTo: 'practice-areas',
      required: true,
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      maxLength: 300,
    },
    {
      name: 'fullStory',
      type: 'richText',
      required: true,
    },
    {
      name: 'outcome',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g., "$2.5M settlement" or "Charges dismissed"',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show on homepage',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
    },
  ],
}
```

### 5. FAQs Collection

```typescript
// collections/Faqs.ts
import { CollectionConfig } from 'payload'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'practice-areas',
      admin: {
        description: 'Which practice area does this FAQ relate to?',
      },
    },
    {
      name: 'priority',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Higher numbers appear first. 0 = normal priority.',
      },
    },
    {
      name: 'showInAI',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Make this available to AI receptionist',
      },
    },
  ],
}
```

### 6. Media Collection (Auto-generated but customizable)

```typescript
// collections/Media.ts
import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 512,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
```

---

## Payload Configuration

### Main Config File

```typescript
// payload.config.ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

// Import collections
import { Attorneys } from './collections/Attorneys'
import { PracticeAreas } from './collections/PracticeAreas'
import { CaseStudies } from './collections/CaseStudies'
import { Faqs } from './collections/Faqs'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Admin configuration
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- Law Firm Admin',
      favicon: '/favicon.ico',
    },
  },

  // Collections (content types)
  collections: [
    Attorneys,
    PracticeAreas,
    CaseStudies,
    Faqs,
    Media,
    // Users collection for admin access
    {
      slug: 'users',
      auth: true,
      access: {
        delete: () => false, // Prevent deletion of admin users
        update: ({ req }) => req.user,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          required: true,
          defaultValue: 'editor',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
          ],
        },
      ],
    },
  ],

  // Rich text editor
  editor: lexicalEditor(),

  // Database adapter
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),

  // Secret for JWT tokens
  secret: process.env.PAYLOAD_SECRET || '',

  // TypeScript generation
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // Sharp for image processing
  sharp,

  // Plugins (add as needed)
  plugins: [],
})
```

### Next.js Configuration

```javascript
// next.config.mjs
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config
  images: {
    domains: ['localhost'],
  },
}

export default withPayload(nextConfig)
```

### Environment Variables

```bash
# .env
# Payload
PAYLOAD_SECRET=your-super-secret-key-here-at-least-32-chars
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Database (Vercel Postgres example)
DATABASE_URI=postgres://user:password@host:port/database

# Optional: File storage (for production)
# BLOB_READ_WRITE_TOKEN=vercel_blob_token
```

---

## Database Options

### Option 1: Vercel Postgres (Recommended for Vercel deployments)

**Pros:**
- Free tier: 256 MB storage, 60 hours compute/month
- Integrated with Vercel
- Easy setup
- Good for small-medium law firm sites

**Setup:**
```bash
# Install adapter
pnpm add @payloadcms/db-postgres

# Create database in Vercel dashboard
# Copy DATABASE_URI to .env
```

**Cost per client:**
- Free tier: $0/month (good for most small firms)
- Pro tier: $20/month (for larger firms with more content)

### Option 2: MongoDB Atlas (Alternative)

**Pros:**
- Free tier: 512 MB storage
- Flexible document storage
- Generous free tier

**Setup:**
```bash
# Install adapter
pnpm add @payloadcms/db-mongodb

# Create cluster at mongodb.com
# Copy connection string to .env as DATABASE_URI
```

### Option 3: Shared Database Approach (Scale to 100+ clients)

**For your business model:**

```typescript
// payload.config.ts with multi-tenancy
export default buildConfig({
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI, // Your shared DB
    },
    // Use schemas for tenant isolation
    schemaName: process.env.CLIENT_ID || 'default',
  }),
  // ... rest of config
})
```

**Cost structure:**
- Single Postgres instance: ~$25/month (Neon, Supabase)
- Support 50-100+ clients on one database
- Cost per client: $0.25-0.50/month

---

## Deployment Strategy

### Per-Client Deployment (Recommended)

Each law firm gets their own:
- Vercel project
- Custom domain
- Isolated content
- Branded admin panel

**Setup:**
```bash
# 1. Clone your template repo
git clone your-law-firm-template my-firm-site
cd my-firm-site

# 2. Customize for client
# - Update branding
# - Configure domain
# - Set environment variables

# 3. Deploy to Vercel
vercel --prod

# 4. Set up database
# - Vercel Postgres in same project (free)
# - Or MongoDB Atlas (free tier)

# 5. Create admin user
pnpm payload create-first-user
```

### One-Click Deploy Template

Create a template repository that clients can deploy:

```bash
# Add deploy button to README
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/law-firm-template)
```

---

## AI Integration

### Querying Payload from Your AI System

```typescript
// lib/ai-payload-integration.ts
import payload from 'payload'

// Initialize Payload
async function getPayloadClient() {
  if (global.payloadInitialized) {
    return payload
  }
  
  await payload.init({
    secret: process.env.PAYLOAD_SECRET!,
    local: true, // Run in local API mode
  })
  
  global.payloadInitialized = true
  return payload
}

// Get FAQs for AI context
export async function getAIContext(practiceArea?: string) {
  const payloadClient = await getPayloadClient()
  
  const faqs = await payloadClient.find({
    collection: 'faqs',
    where: {
      showInAI: {
        equals: true,
      },
      ...(practiceArea && {
        'category.slug': {
          equals: practiceArea,
        },
      }),
    },
    limit: 50,
    sort: '-priority',
  })
  
  return faqs.docs.map(faq => ({
    question: faq.question,
    answer: faq.answer, // Convert rich text to plain text
    category: faq.category?.name,
  }))
}

// Get practice area details for AI
export async function getPracticeAreaInfo(slug: string) {
  const payloadClient = await getPayloadClient()
  
  const practiceArea = await payloadClient.find({
    collection: 'practice-areas',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })
  
  if (practiceArea.docs.length === 0) {
    return null
  }
  
  const area = practiceArea.docs[0]
  
  return {
    name: area.name,
    description: area.description,
    faqs: area.faqs,
    intakeQuestions: area.intakeQuestions,
  }
}

// Get available attorneys for scheduling
export async function getAvailableAttorneys(practiceAreaSlug: string) {
  const payloadClient = await getPayloadClient()
  
  const attorneys = await payloadClient.find({
    collection: 'attorneys',
    where: {
      status: {
        equals: 'active',
      },
      'practiceAreas.slug': {
        equals: practiceAreaSlug,
      },
    },
  })
  
  return attorneys.docs.map(attorney => ({
    name: attorney.name,
    title: attorney.title,
    email: attorney.email,
    phone: attorney.phone,
  }))
}
```

### API Route for AI System

```typescript
// app/api/ai-context/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAIContext, getPracticeAreaInfo } from '@/lib/ai-payload-integration'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const practiceArea = searchParams.get('practiceArea')
  
  // Get FAQs and practice area info
  const [faqs, areaInfo] = await Promise.all([
    getAIContext(practiceArea || undefined),
    practiceArea ? getPracticeAreaInfo(practiceArea) : null,
  ])
  
  return NextResponse.json({
    faqs,
    practiceArea: areaInfo,
  })
}
```

### Using in Your AI Receptionist

```typescript
// Your AI system makes a request to the law firm's site
async function getClientContext(firmDomain: string, practiceArea: string) {
  const response = await fetch(
    `https://${firmDomain}/api/ai-context?practiceArea=${practiceArea}`
  )
  
  const data = await response.json()
  
  // Feed this to your AI model as context
  return {
    systemPrompt: `You are an AI receptionist for a law firm specializing in ${data.practiceArea.name}. 
    
Here are the firm's FAQs:
${data.faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')}

Practice Area Info:
${data.practiceArea.description}`,
    intakeQuestions: data.practiceArea.intakeQuestions,
  }
}
```

---

## Client Customization

### Branding Per Client

```typescript
// lib/brand-config.ts
export const brandConfig = {
  firmName: process.env.NEXT_PUBLIC_FIRM_NAME || 'Law Firm',
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#1a202c',
  logo: process.env.NEXT_PUBLIC_LOGO_URL || '/logo.png',
  phone: process.env.NEXT_PUBLIC_PHONE || '(555) 555-5555',
  email: process.env.NEXT_PUBLIC_EMAIL || 'contact@lawfirm.com',
  address: process.env.NEXT_PUBLIC_ADDRESS || '123 Main St',
}
```

### Custom Admin Panel Branding

```typescript
// payload.config.ts
export default buildConfig({
  admin: {
    meta: {
      titleSuffix: `- ${process.env.FIRM_NAME} Admin`,
      favicon: '/admin-favicon.ico',
      ogImage: '/admin-og-image.png',
    },
    components: {
      graphics: {
        Logo: '/admin-logo.tsx', // Custom logo component
        Icon: '/admin-icon.tsx',
      },
    },
  },
  // ...
})
```

---

## Production Checklist

### Before Deploying for a Client:

- [ ] Customize branding (colors, logo, firm name)
- [ ] Set up custom domain
- [ ] Configure database (Vercel Postgres or MongoDB Atlas)
- [ ] Set all environment variables
- [ ] Create initial admin user
- [ ] Add sample content (1-2 attorneys, practice areas)
- [ ] Test AI integration endpoints
- [ ] Configure email (for password resets)
- [ ] Set up SSL certificate (automatic with Vercel)
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit (aim for 90+ scores)

### Environment Variables Needed:

```bash
# Required
PAYLOAD_SECRET=              # 32+ character random string
DATABASE_URI=                # Postgres or MongoDB connection string
NEXT_PUBLIC_SERVER_URL=      # https://lawfirm.com

# Branding
NEXT_PUBLIC_FIRM_NAME=
NEXT_PUBLIC_PRIMARY_COLOR=
NEXT_PUBLIC_PHONE=
NEXT_PUBLIC_EMAIL=

# Optional
BLOB_READ_WRITE_TOKEN=       # For Vercel Blob storage (images)
```

---

## Cost Breakdown Per Client

### Minimal Setup (Free tier):
```
Domain: $12/year = $1/month
Vercel Hosting: Free (Pro if needed: $20/month)
Vercel Postgres: Free (256 MB)
Or MongoDB Atlas: Free (512 MB)

Total: $1-21/month per client
```

### Your Pricing:
```
Charge client: $200-500/month (website + CMS + AI integration)
Your costs: $1-21/month
Margin: $179-499/month per client
```

### At Scale (100 clients):
```
Shared Postgres: $25/month
100 Vercel free tier projects: $0
Domains: $100/month

Total infrastructure: ~$125/month
Revenue (at $300/month average): $30,000/month
Margin: $29,875/month 🚀
```

---

## Next Steps

1. **Create Template Repository**
   - Set up base law firm site with Payload
   - Include all collections above
   - Create documentation for customization

2. **Build Deployment Scripts**
   - Automate new client setup
   - Database initialization
   - Environment variable templates

3. **Test AI Integration**
   - Build API endpoints
   - Test with your AI receptionist
   - Document the integration flow

4. **Create Client Onboarding Process**
   - Checklist for new deployments
   - Training materials for attorneys
   - Support documentation

---

## Resources

- [Payload Documentation](https://payloadcms.com/docs)
- [Payload GitHub](https://github.com/payloadcms/payload)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## Support & Questions

For questions specific to your implementation:
1. Check Payload docs first
2. Search GitHub issues
3. Join Payload Discord community
4. Post in Next.js discussions

This setup gives you a professional, scalable CMS solution for law firm clients with zero per-client backend costs! 🎉
