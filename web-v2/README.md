# ODEUO AI - Law Firm Transformation Landing Page

A modern, high-performance landing page for ODEUO AI Automation services targeting law firms. Built with Next.js 15, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion, and Three.js.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15 with App Router, TypeScript, Tailwind CSS v4
- **Stunning Animations**: Framer Motion for smooth, professional animations
- **3D Background**: Three.js particle field for subtle visual interest
- **Component Library**: shadcn/ui for consistent, accessible UI components
- **Responsive Design**: Mobile-first approach optimized for all devices
- **Performance Optimized**: Built for Lighthouse scores of 90+
- **Legal Industry Focus**: Professional design tailored for law firms

## 📦 Tech Stack

- **Framework**: Next.js 15.5.6 with Turbopack
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 with custom theme
- **UI Components**: shadcn/ui (New York style)
- **Animations**: Framer Motion
- **3D Graphics**: Three.js with @react-three/fiber and @react-three/drei
- **Icons**: Lucide React

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## 🎨 Design System

### Color Palette
- **Primary**: Navy Blue (#1E3A8A) - Trust and authority
- **Accent**: Gold (#D97706) - Premium and professional
- **Background**: Light gray (#FAFAFA) - Clean and modern
- **Text**: Slate (#0F172A) - High contrast readability

### Typography
- **Display Font**: Playfair Display (serif) - Authority and elegance
- **Body Font**: Inter (sans-serif) - Modern readability

### Custom Utilities
- `heading-hero`, `heading-xl`, `heading-lg`, `heading-md` - Typography scales
- `body-lg`, `body-base` - Body text styles
- `gradient-navy`, `gradient-gold`, `gradient-text` - Gradient utilities
- `glass`, `glass-dark` - Glassmorphism effects

## 🏗️ Project Structure

```
web/
├── app/
│   ├── globals.css          # Global styles and theme
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── separator.tsx
│   ├── sections/            # Page sections
│   │   ├── hero-section.tsx
│   │   ├── problem-section.tsx
│   │   ├── solution-section.tsx
│   │   ├── transformation-section.tsx
│   │   ├── cta-section.tsx
│   │   └── footer.tsx
│   └── three-background.tsx # 3D particle background
├── lib/
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
```

## 📄 Page Sections

1. **Hero Section**: Eye-catching introduction with 3D background, main value proposition, and CTAs
2. **Problem Section**: Highlights pain points law firms face with missed calls and coverage gaps
3. **Solution Section**: Showcases the AI Voice Receptionist as the flagship product
4. **Transformation Section**: Explains the 4-phase transformation approach
5. **CTA Section**: Final call-to-action for scheduling a practice audit
6. **Footer**: Company information and navigation links

## 🎯 Key Features

### Hero Section
- Animated 3D particle background using Three.js
- Gradient text effects
- Smooth entrance animations
- Clear value proposition
- Dual CTAs (Primary: Free Audit, Secondary: Demo)

### Problem Section
- 6 key pain points with icons and statistics
- Hover effects on cards
- Cost impact visualization
- Staggered animations on scroll

### Solution Section
- Detailed feature breakdown
- "How It Works" step-by-step guide
- Team augmentation messaging
- Professional glassmorphism effects

### Transformation Section
- 4-phase approach visualization
- Color-coded phases
- Expected results for each phase
- ROI metrics display

### CTA Section
- High-contrast design with gradient background
- Clear benefits checklist
- Dual action buttons
- Trust indicators

## 🎨 Customization

### Theme Colors
Edit `app/globals.css` to customize the color scheme:

```css
:root {
  --primary: #1E3A8A;  /* Navy blue */
  --accent: #D97706;   /* Gold */
  /* ... other colors */
}
```

### Typography
Fonts are loaded from Google Fonts. To change fonts, update the import in `globals.css`.

## 📱 Responsive Design

The landing page is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## ⚡ Performance

- Server-side rendering with Next.js
- Optimized images with Next.js Image component
- Code splitting and lazy loading
- Minimal JavaScript bundle size
- CSS optimization with Tailwind CSS

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

Built with ❤️ for transforming law practices through AI automation