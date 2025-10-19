'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, Cookie, Shield, BarChart3 } from 'lucide-react'

interface CookieConsentProps {
  onAccept: () => void
  onDecline: () => void
}

export function CookieConsent({ onAccept, onDecline }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setIsVisible(false)
    onAccept()
  }

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setIsVisible(false)
    onDecline()
  }

  const handleAcceptEssential = () => {
    localStorage.setItem('cookie-consent', 'essential-only')
    setIsVisible(false)
    onDecline() // Only essential cookies, no analytics
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Cookie className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">
                We Value Your Privacy
              </h3>
              <p className="text-muted-foreground mb-4">
                We use cookies to enhance your experience, analyze site traffic, and provide personalized content. 
                Your privacy is important to us, and we're committed to transparency about how we use your data.
              </p>

              {showDetails && (
                <div className="mb-4 space-y-3 text-sm">
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Shield className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Essential Cookies</h4>
                      <p className="text-muted-foreground">
                        Required for basic site functionality, security, and user preferences. These cannot be disabled.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Analytics Cookies</h4>
                      <p className="text-muted-foreground">
                        Help us understand how visitors interact with our website to improve user experience. 
                        Data is anonymized and used only for statistical purposes.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleAccept} className="bg-primary hover:bg-primary/90">
                  Accept All Cookies
                </Button>
                <Button onClick={handleAcceptEssential} variant="outline">
                  Essential Only
                </Button>
                <Button 
                  onClick={() => setShowDetails(!showDetails)} 
                  variant="ghost"
                  size="sm"
                >
                  {showDetails ? 'Hide Details' : 'Cookie Details'}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                By continuing to use our site, you agree to our{' '}
                <a href="/privacy" className="underline hover:text-primary">Privacy Policy</a>
                {' '}and{' '}
                <a href="/terms" className="underline hover:text-primary">Terms of Service</a>.
              </p>
            </div>
            <Button
              onClick={handleDecline}
              variant="ghost"
              size="sm"
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook to manage cookie consent state
export function useCookieConsent() {
  const [consent, setConsent] = useState<'accepted' | 'declined' | 'essential-only' | null>(null)

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookie-consent') as typeof consent
    setConsent(storedConsent)
  }, [])

  const updateConsent = (newConsent: typeof consent) => {
    if (newConsent) {
      localStorage.setItem('cookie-consent', newConsent)
    } else {
      localStorage.removeItem('cookie-consent')
    }
    setConsent(newConsent)
  }

  return {
    consent,
    updateConsent,
    hasConsented: consent === 'accepted',
    hasDeclined: consent === 'declined' || consent === 'essential-only',
    isEssentialOnly: consent === 'essential-only'
  }
}
