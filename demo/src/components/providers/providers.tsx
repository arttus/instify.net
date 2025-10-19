'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from './theme-provider'
import { CopilotProvider } from './copilot-provider'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <CopilotProvider>
          {children}
        </CopilotProvider>
      </ThemeProvider>
    </ClerkProvider>
  )
}
