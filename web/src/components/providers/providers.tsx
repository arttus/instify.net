'use client'

import { ThemeProvider } from './theme-provider'
import { CopilotProvider } from './copilot-provider'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <CopilotProvider>
        {children}
      </CopilotProvider>
    </ThemeProvider>
  )
}
