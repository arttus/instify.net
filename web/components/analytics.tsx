'use client'

import Script from 'next/script'
import { useEffect } from 'react'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'
const GA_DEBUG = process.env.NEXT_PUBLIC_GA_DEBUG === 'true'

export function GoogleAnalytics() {
  useEffect(() => {
    // Set up enhanced ecommerce and custom dimensions
    if (typeof window !== 'undefined' && window.gtag) {
      // Configure enhanced ecommerce
      window.gtag('config', GA_MEASUREMENT_ID, {
        custom_map: {
          'custom_dimension_1': 'practice_area',
          'custom_dimension_2': 'lead_source',
          'custom_dimension_3': 'visitor_type',
          'custom_dimension_4': 'engagement_level'
        }
      })
    }
  }, [])

  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    if (GA_DEBUG) {
      console.log('Google Analytics: No measurement ID provided')
    }
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
            send_page_view: true,
            anonymize_ip: true,
            allow_google_signals: true,
            allow_ad_personalization_signals: false,
            cookie_flags: 'SameSite=None;Secure',
            debug_mode: ${GA_DEBUG}
          });

          // Set up scroll tracking
          let scrollTimer = null;
          let scrollDepth = 0;

          window.addEventListener('scroll', function() {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(function() {
              const currentScroll = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
              if (currentScroll > scrollDepth && currentScroll % 25 === 0) {
                scrollDepth = currentScroll;
                gtag('event', 'scroll_depth', {
                  event_category: 'engagement',
                  event_label: currentScroll + '%',
                  value: currentScroll
                });
              }
            }, 100);
          });
        `}
      </Script>
    </>
  )
}

// Enhanced tracking functions
export const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    if (GA_DEBUG) {
      console.log('GA Event:', eventName, parameters)
    }
    window.gtag('event', eventName, parameters)
  }
}

// Lead Generation Events
export const trackPhoneCall = (location: string = 'header') => {
  trackEvent('phone_call_click', {
    event_category: 'lead_generation',
    event_label: `phone_${location}`,
    value: 10, // Assign lead value
    custom_dimension_2: 'phone_call',
    custom_dimension_4: 'high'
  })
}

export const trackContactForm = (formType: string, practiceArea?: string) => {
  trackEvent('contact_form_submit', {
    event_category: 'lead_generation',
    event_label: formType,
    value: 15, // Higher value for form submissions
    custom_dimension_1: practiceArea || 'general',
    custom_dimension_2: 'contact_form',
    custom_dimension_4: 'high'
  })
}

export const trackDemoRequest = (source: string = 'button') => {
  trackEvent('demo_request', {
    event_category: 'lead_generation',
    event_label: `demo_${source}`,
    value: 20, // High value for demo requests
    custom_dimension_2: 'demo_request',
    custom_dimension_4: 'very_high'
  })
}

export const trackConsultationRequest = (practiceArea?: string) => {
  trackEvent('consultation_request', {
    event_category: 'lead_generation',
    event_label: 'schedule_consultation',
    value: 25, // Highest value for consultation requests
    custom_dimension_1: practiceArea || 'general',
    custom_dimension_2: 'consultation',
    custom_dimension_4: 'very_high'
  })
}

// Practice Area Interest Tracking
export const trackPracticeAreaInterest = (practiceArea: string, action: string = 'click') => {
  trackEvent('practice_area_interest', {
    event_category: 'engagement',
    event_label: `${practiceArea}_${action}`,
    value: 5,
    custom_dimension_1: practiceArea,
    custom_dimension_4: 'medium'
  })
}

// Blog Engagement Events
export const trackBlogView = (articleTitle: string, category: string, readingTime: number) => {
  trackEvent('blog_article_view', {
    event_category: 'content_engagement',
    event_label: articleTitle,
    value: 3,
    custom_dimension_1: category,
    custom_dimension_2: 'blog_content',
    custom_dimension_4: 'medium',
    reading_time: readingTime
  })
}

export const trackBlogReadingProgress = (articleTitle: string, percentage: number) => {
  if (percentage === 25 || percentage === 50 || percentage === 75 || percentage === 100) {
    trackEvent('blog_reading_progress', {
      event_category: 'content_engagement',
      event_label: `${articleTitle}_${percentage}%`,
      value: percentage === 100 ? 5 : 2,
      custom_dimension_4: percentage >= 75 ? 'high' : 'medium'
    })
  }
}

export const trackBlogShare = (articleTitle: string, platform: string) => {
  trackEvent('blog_share', {
    event_category: 'social_engagement',
    event_label: `${platform}_${articleTitle}`,
    value: 8,
    custom_dimension_2: 'social_share',
    custom_dimension_4: 'high'
  })
}

// ROI Calculator Events
export const trackROICalculatorStart = () => {
  trackEvent('roi_calculator_start', {
    event_category: 'tool_engagement',
    event_label: 'calculator_opened',
    value: 8,
    custom_dimension_2: 'roi_calculator',
    custom_dimension_4: 'high'
  })
}

export const trackROICalculatorComplete = (estimatedROI: number, firmSize: string) => {
  trackEvent('roi_calculator_complete', {
    event_category: 'tool_engagement',
    event_label: `roi_${estimatedROI}_${firmSize}`,
    value: 12,
    custom_dimension_2: 'roi_calculator',
    custom_dimension_3: firmSize,
    custom_dimension_4: 'very_high',
    estimated_roi: estimatedROI
  })
}

// Video and Media Engagement
export const trackVideoPlay = (videoTitle: string, location: string) => {
  trackEvent('video_play', {
    event_category: 'media_engagement',
    event_label: `${videoTitle}_${location}`,
    value: 6,
    custom_dimension_4: 'high'
  })
}

export const trackVideoComplete = (videoTitle: string, duration: number) => {
  trackEvent('video_complete', {
    event_category: 'media_engagement',
    event_label: videoTitle,
    value: 10,
    custom_dimension_4: 'very_high',
    video_duration: duration
  })
}

// Navigation and User Journey
export const trackPageView = (pageName: string, practiceArea?: string) => {
  trackEvent('page_view', {
    event_category: 'navigation',
    event_label: pageName,
    custom_dimension_1: practiceArea || 'general',
    custom_dimension_2: 'page_view'
  })
}

export const trackSiteSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent('site_search', {
    event_category: 'search',
    event_label: searchTerm,
    value: 4,
    custom_dimension_4: 'medium',
    search_results: resultsCount
  })
}

// Conversion Funnel Events
export const trackFunnelStep = (step: string, funnelName: string, practiceArea?: string) => {
  trackEvent('funnel_step', {
    event_category: 'conversion_funnel',
    event_label: `${funnelName}_${step}`,
    value: 3,
    custom_dimension_1: practiceArea || 'general',
    custom_dimension_2: funnelName,
    funnel_step: step
  })
}

// Error and Performance Tracking
export const trackError = (errorType: string, errorMessage: string, page: string) => {
  trackEvent('error_occurred', {
    event_category: 'errors',
    event_label: `${errorType}_${page}`,
    value: 0,
    error_message: errorMessage,
    error_page: page
  })
}

export const trackPerformance = (metric: string, value: number, page: string) => {
  trackEvent('performance_metric', {
    event_category: 'performance',
    event_label: `${metric}_${page}`,
    value: 0,
    metric_value: value,
    metric_name: metric
  })
}

// Enhanced Ecommerce for Lead Tracking
export const trackLead = (leadType: string, leadValue: number, practiceArea: string, source: string) => {
  trackEvent('generate_lead', {
    event_category: 'ecommerce',
    currency: 'USD',
    value: leadValue,
    items: [{
      item_id: `lead_${Date.now()}`,
      item_name: `${practiceArea} Lead`,
      item_category: leadType,
      item_variant: source,
      price: leadValue,
      quantity: 1
    }],
    custom_dimension_1: practiceArea,
    custom_dimension_2: source,
    custom_dimension_4: leadValue > 20 ? 'very_high' : leadValue > 10 ? 'high' : 'medium'
  })
}

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void
  }
}
