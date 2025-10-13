'use client'

import { CopilotKit } from '@copilotkit/react-core'
import { CopilotPopup } from '@copilotkit/react-ui'
import '@copilotkit/react-ui/styles.css'

interface CopilotProviderProps {
  children: React.ReactNode
}

export function CopilotProvider({ children }: CopilotProviderProps) {
  return (
    <CopilotKit
      publicApiKey="ck_pub_64c40c62a18089e4cc49ffba6493aa25"
      // AG-UI compatible configuration
      showDevConsole={process.env.NODE_ENV === 'development'}
    >
      {children}
      <CopilotPopup
        instructions="You are an AI assistant for Instify, a multi-tenant B2B SaaS platform for AI-powered customer engagement automation. You follow the AG-UI protocol for agent-user interactions. Help users with their questions about the platform, automation workflows, and customer engagement strategies. You can help with:

- Setting up automation workflows
- Understanding customer engagement metrics
- Configuring multi-channel communications (Instagram DMs, SMS, WhatsApp, voice)
- Managing tenant organizations and users
- Troubleshooting platform issues

Always provide helpful, accurate information and ask clarifying questions when needed."
        labels={{
          title: "Instify AI Assistant (AG-UI Compatible)",
          initial: "Hi! I'm your Instify AI assistant, powered by the AG-UI protocol. How can I help you today?",
          placeholder: "Ask me about automation workflows, customer engagement, or platform features...",
        }}
        defaultOpen={false}
        clickOutsideToClose={true}
        shortcut="/"
      />
    </CopilotKit>
  )
}
