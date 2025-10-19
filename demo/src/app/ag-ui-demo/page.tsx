import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AgentStatus } from "@/components/ag-ui/agent-status"
import { SharedState } from "@/components/ag-ui/shared-state"
import { EventStream } from "@/components/ag-ui/event-stream"

export default function AgUiDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            AG-UI Protocol Demo
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            Experience the Agent-User Interaction Protocol in action. AG-UI standardizes how AI agents 
            connect to user-facing applications with real-time event streaming, shared state management, 
            and interactive agent controls.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <a href="https://docs.ag-ui.com" target="_blank" rel="noopener noreferrer">
                View AG-UI Docs
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/" >
                Back to Home
              </a>
            </Button>
          </div>
        </div>

        {/* Protocol Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🤖 What is AG-UI?
            </CardTitle>
            <CardDescription>
              The Agent-User Interaction Protocol
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">🔄</div>
                <h3 className="font-semibold mb-2">Event-Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time bidirectional communication between agents and applications
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">🔗</div>
                <h3 className="font-semibold mb-2">Shared State</h3>
                <p className="text-sm text-muted-foreground">
                  Synchronized state management with conflict resolution
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold mb-2">Interactive</h3>
                <p className="text-sm text-muted-foreground">
                  Human-in-the-loop controls with interrupts and steering
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Demo Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Agent Status */}
          <AgentStatus className="h-fit" />
          
          {/* Shared State */}
          <SharedState className="h-fit" />
        </div>

        {/* Event Stream */}
        <EventStream className="mb-8" />

        {/* Integration Info */}
        <Card>
          <CardHeader>
            <CardTitle>🔧 AG-UI Integration with ODEUO</CardTitle>
            <CardDescription>
              How ODEUO leverages the AG-UI protocol for customer engagement automation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Supported Features</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Real-time agent status monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Shared state synchronization
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Event streaming and logging
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Agent interruption controls
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    Tool call visualization (coming soon)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    Multi-modal messaging (coming soon)
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Use Cases</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Monitor Instagram DM automation agents</li>
                  <li>• Track SMS campaign performance in real-time</li>
                  <li>• Manage WhatsApp conversation flows</li>
                  <li>• Control voice call AI assistants</li>
                  <li>• Debug multi-tenant automation workflows</li>
                  <li>• Coordinate between multiple AI agents</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            AG-UI Protocol Demo • Built with CopilotKit, ShadCN UI, and Next.js
          </p>
          <p className="mt-2">
            Learn more at{" "}
            <a 
              href="https://docs.ag-ui.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              docs.ag-ui.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
