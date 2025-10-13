import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConnectionStatus } from "@/components/livekit/connection-status"
import { RoomControls } from "@/components/livekit/room-controls"
import { VoiceAIDemo } from "@/components/livekit/voice-ai-demo"

export default function LiveKitDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            LiveKit Voice AI Demo
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            Experience real-time voice and video communication powered by LiveKit. 
            This demo showcases AI-powered voice interactions, room management, 
            and multi-participant communication for customer engagement automation.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <a href="https://livekit.io" target="_blank" rel="noopener noreferrer">
                View LiveKit Docs
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/">
                Back to Home
              </a>
            </Button>
          </div>
        </div>

        {/* LiveKit Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎙️ What is LiveKit?
            </CardTitle>
            <CardDescription>
              Open source platform for real-time video, audio, and data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">🎤</div>
                <h3 className="font-semibold mb-2">Voice AI</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time speech recognition and AI-powered voice responses
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">📹</div>
                <h3 className="font-semibold mb-2">Video Calls</h3>
                <p className="text-sm text-muted-foreground">
                  High-quality video conferencing with screen sharing
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">🌐</div>
                <h3 className="font-semibold mb-2">Multi-Platform</h3>
                <p className="text-sm text-muted-foreground">
                  Works across web, mobile, and desktop applications
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Connection Status */}
          <ConnectionStatus className="h-fit" />
          
          {/* Room Controls */}
          <RoomControls className="h-fit" />
        </div>

        {/* Voice AI Demo */}
        <VoiceAIDemo className="mb-8" />

        {/* Integration Info */}
        <Card>
          <CardHeader>
            <CardTitle>🔧 LiveKit Integration with Instify</CardTitle>
            <CardDescription>
              How Instify leverages LiveKit for customer engagement automation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Voice AI Features</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Real-time speech-to-text transcription
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    AI-powered response generation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Multi-language support
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Conversation context awareness
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    Voice cloning (coming soon)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    Emotion detection (coming soon)
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Use Cases</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• AI-powered customer support calls</li>
                  <li>• Automated sales qualification calls</li>
                  <li>• Voice-based order processing</li>
                  <li>• Multi-language customer service</li>
                  <li>• Real-time call transcription and analysis</li>
                  <li>• Voice-activated automation triggers</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">🏗️ Architecture</h4>
              <p className="text-sm text-muted-foreground">
                LiveKit server runs in Docker alongside PostgreSQL and Redis. 
                The web application connects via WebRTC for low-latency audio/video streaming. 
                AI processing happens server-side with OpenAI/Anthropic APIs for natural language understanding.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            LiveKit Demo • Built with Next.js, ShadCN UI, and WebRTC
          </p>
          <p className="mt-2">
            Learn more at{" "}
            <a 
              href="https://livekit.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              livekit.io
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
