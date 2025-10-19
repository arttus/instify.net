# Google Analytics 4 Setup Guide for ODEUO AI

## 🎯 Overview

This guide will help you set up comprehensive Google Analytics 4 tracking for the ODEUO AI website, specifically tailored for law firm lead generation and client acquisition tracking.

## 📋 Prerequisites

- Google account with access to Google Analytics
- Admin access to the ODEUO AI website
- Basic understanding of Google Analytics concepts

## 🚀 Step 1: Create Google Analytics 4 Property

### 1.1 Create GA4 Account
1. Go to [Google Analytics](https://analytics.google.com)
2. Click "Start measuring" or "Create Account"
3. Enter account details:
   - **Account Name**: `ODEUO AI`
   - **Data Sharing Settings**: Enable recommended settings

### 1.2 Create Property
1. **Property Name**: `ODEUO AI Website`
2. **Reporting Time Zone**: Select your business timezone
3. **Currency**: USD (United States Dollar)
4. **Industry Category**: Professional Services > Legal Services
5. **Business Size**: Select appropriate size

### 1.3 Set Up Data Stream
1. Choose "Web" platform
2. **Website URL**: `https://odeuo.com`
3. **Stream Name**: `ODEUO AI Main Website`
4. **Enhanced Measurement**: Enable all options:
   - ✅ Page views
   - ✅ Scrolls
   - ✅ Outbound clicks
   - ✅ Site search
   - ✅ Video engagement
   - ✅ File downloads

### 1.4 Get Measurement ID
1. Copy your **Measurement ID** (format: G-XXXXXXXXXX)
2. Save this for the next step

## 🔧 Step 2: Configure Environment Variables

### 2.1 Update .env.local
Replace the placeholder in `web-v3/.env.local`:

```bash
# Replace G-ODEUO12345 with your actual measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-YOUR_ACTUAL_ID_HERE
```

### 2.2 Production Environment
For production deployment, set the environment variable:

```bash
# Vercel/Netlify
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-YOUR_ACTUAL_ID_HERE

# Docker/Server
export NEXT_PUBLIC_GA_MEASUREMENT_ID=G-YOUR_ACTUAL_ID_HERE
```

## 📊 Step 3: Configure Custom Dimensions

Set up custom dimensions in GA4 for law firm specific tracking:

### 3.1 Create Custom Dimensions
Go to **Admin > Property > Custom Definitions > Custom Dimensions**

Create these dimensions:

1. **Practice Area**
   - Dimension name: `practice_area`
   - Scope: Event
   - Description: `Legal practice area of interest`

2. **Lead Source**
   - Dimension name: `lead_source`
   - Scope: Event
   - Description: `Source of lead generation`

3. **Visitor Type**
   - Dimension name: `visitor_type`
   - Scope: Event
   - Description: `Type of website visitor`

4. **Engagement Level**
   - Dimension name: `engagement_level`
   - Scope: Event
   - Description: `Level of user engagement`

## 🎯 Step 4: Set Up Conversion Goals

### 4.1 Create Conversion Events
Go to **Admin > Property > Events > Mark as conversion**

Mark these events as conversions:

1. **phone_call_click** - Phone call button clicks
2. **contact_form_submit** - Contact form submissions
3. **demo_request** - Live demo requests
4. **consultation_request** - Consultation bookings
5. **generate_lead** - Enhanced ecommerce lead tracking

### 4.2 Set Up Enhanced Ecommerce
1. Go to **Admin > Property > Data Settings > Data Collection**
2. Enable **Enhanced ecommerce**
3. Configure **Lead Value Tracking**:
   - Phone calls: $10
   - Contact forms: $15
   - Demo requests: $20
   - Consultations: $25

## 📈 Step 5: Create Custom Reports

### 5.1 Lead Generation Report
Create a custom report to track:
- Lead sources and conversion rates
- Practice area performance
- ROI by traffic source
- Conversion funnel analysis

### 5.2 Content Performance Report
Track blog and content engagement:
- Most read articles
- Reading completion rates
- Content-to-lead conversion
- Practice area content performance

### 5.3 User Journey Report
Analyze visitor behavior:
- Page flow and navigation patterns
- Time to conversion
- Multi-session conversion paths
- Device and location insights

## 🔒 Step 6: Privacy and Compliance

### 6.1 Cookie Consent (Currently Disabled)
Cookie consent system is commented out for US market:
- No GDPR/CCPA compliance required for domestic operations
- Analytics enabled by default (standard US practice)
- Cookie consent code preserved for future EU expansion
- Can be re-enabled by uncommenting code in `/components/client-providers.tsx`

### 6.2 Data Retention
Configure data retention in GA4:
1. Go to **Admin > Property > Data Settings > Data Retention**
2. Set **Event data retention**: 26 months (maximum)
3. Enable **Reset user data on new activity**

### 6.3 IP Anonymization
IP anonymization is automatically enabled in the setup.

## 🧪 Step 7: Testing and Verification

### 7.1 Real-Time Testing
1. Go to **Reports > Realtime**
2. Visit your website in a new browser tab
3. Verify events are being tracked:
   - Page views
   - Scroll tracking
   - Button clicks
   - Form submissions

### 7.2 Debug Mode
Enable debug mode for testing:
```bash
NEXT_PUBLIC_GA_DEBUG=true
```

### 7.3 Google Analytics Debugger
Install the [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome extension for detailed event tracking.

## 📊 Step 8: Key Metrics to Monitor

### 8.1 Lead Generation Metrics
- **Conversion Rate**: Visitors to leads
- **Cost Per Lead**: Marketing spend / leads
- **Lead Quality Score**: Based on engagement level
- **Practice Area Performance**: Which areas generate most leads

### 8.2 Content Metrics
- **Blog Engagement**: Reading time and completion
- **Content-to-Lead**: Which content drives conversions
- **SEO Performance**: Organic traffic and rankings
- **Social Sharing**: Content virality

### 8.3 User Experience Metrics
- **Page Load Speed**: Core Web Vitals
- **Bounce Rate**: By page and traffic source
- **Session Duration**: Engagement quality
- **Mobile Performance**: Mobile vs desktop

## 🚨 Troubleshooting

### Common Issues:

1. **Events Not Tracking**
   - Check measurement ID is correct
   - Verify environment variables are loaded
   - Check browser console for errors

2. **Real-Time Data Missing**
   - Wait 24-48 hours for full data processing
   - Check if ad blockers are interfering
   - Cookie consent is disabled, so no consent-related issues

3. **Conversion Goals Not Working**
   - Ensure events are marked as conversions
   - Check custom dimension mapping
   - Verify event parameters are correct

## 📞 Support

For technical support with analytics setup:
- Email: tech@odeuo.com
- Documentation: This guide
- Google Analytics Help: [support.google.com/analytics](https://support.google.com/analytics)

---

**Next Steps**: Once analytics is set up, monitor the dashboard daily and create weekly reports to optimize lead generation and content performance.
