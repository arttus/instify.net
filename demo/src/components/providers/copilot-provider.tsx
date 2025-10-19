'use client'

// TEMPORARY FIX: CopilotKit disabled for local development
// The CopilotKit component with publicApiKey was causing requests to hang
// as it tries to connect to external services during SSR/initial render
// TODO: Re-enable with proper configuration once API connectivity is stable

interface CopilotProviderProps {
  children: React.ReactNode
}

export function CopilotProvider({ children }: CopilotProviderProps) {
  // For now, just pass through children without CopilotKit wrapper
  // This allows the app to load without hanging on external API calls
  return <>{children}</>
}

// Original CopilotKit implementation (commented out):
// import { CopilotKit } from '@copilotkit/react-core'
// import { CopilotPopup } from '@copilotkit/react-ui'
// import '@copilotkit/react-ui/styles.css'
//
// export function CopilotProvider({ children }: CopilotProviderProps) {
//   return (
//     <CopilotKit
//       publicApiKey="ck_pub_64c40c62a18089e4cc49ffba6493aa25"
//       // AG-UI compatible configuration
//       showDevConsole={process.env.NODE_ENV === 'development'}
//     >
//       {children}
//       <CopilotPopup
//         instructions="You are an AI assistant for ODEUO, a multi-tenant B2B SaaS platform for AI-powered customer engagement automation. You follow the AG-UI protocol for agent-user interactions. Help users with their questions about the platform, automation workflows, and customer engagement strategies. You can help with:
//
// - Setting up automation workflows
// - Understanding customer engagement metrics
// - Configuring multi-channel communications (Instagram DMs, SMS, WhatsApp, voice)
// - Managing tenant organizations and users
// - Troubleshooting platform issues
//
// Always provide helpful, accurate information and ask clarifying questions when needed."
//         labels={{
//           title: "ODEUO AI Assistant",
//           initial: "Hi! I'm your ODEUO AI assistant, powered by the AG-UI protocol. How can I help you today?",
//           placeholder: "Ask me about automation workflows, customer engagement, or platform features...",
//         }}
//         defaultOpen={false}
//         clickOutsideToClose={true}
//         shortcut="/"
//       />
//     </CopilotKit>
//   )
// }
