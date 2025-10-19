'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface VoiceAIDemoProps {
  className?: string
}

interface ConversationMessage {
  id: string
  speaker: 'user' | 'ai'
  message: string
  timestamp: Date
  confidence?: number
}

export function VoiceAIDemo({ className }: VoiceAIDemoProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversation, setConversation] = useState<ConversationMessage[]>([])
  const [currentTranscript, setCurrentTranscript] = useState('')

  // Mock conversation starters
  const mockResponses = [
    "Hello! I'm your AI assistant. How can I help you with your customer engagement today?",
    "I can help you set up automation workflows for Instagram DMs, SMS, and WhatsApp.",
    "Would you like me to analyze your recent customer interactions?",
    "I can help you create personalized responses for your customers.",
    "Let me know if you need assistance with voice call automation.",
  ]

  const handleStartRecording = () => {
    setIsRecording(true)
    setCurrentTranscript('')
    
    // Simulate real-time transcription
    const transcriptTexts = [
      "Hello",
      "Hello, I need help",
      "Hello, I need help with",
      "Hello, I need help with setting up",
      "Hello, I need help with setting up automation",
      "Hello, I need help with setting up automation for my business"
    ]
    
    let index = 0
    const interval = setInterval(() => {
      if (index < transcriptTexts.length) {
        setCurrentTranscript(transcriptTexts[index])
        index++
      } else {
        clearInterval(interval)
      }
    }, 500)
    
    // Auto-stop after 3 seconds
    setTimeout(() => {
      if (isRecording) {
        handleStopRecording()
      }
      clearInterval(interval)
    }, 3000)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setIsProcessing(true)
    
    // Add user message
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      speaker: 'user',
      message: currentTranscript || "Hello, I need help with setting up automation for my business",
      timestamp: new Date(),
      confidence: 0.95
    }
    
    setConversation(prev => [...prev, userMessage])
    setCurrentTranscript('')
    
    // Simulate AI processing and response
    setTimeout(() => {
      setIsProcessing(false)
      
      const aiResponse: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        speaker: 'ai',
        message: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        timestamp: new Date(),
        confidence: 0.98
      }
      
      setConversation(prev => [...prev, aiResponse])
    }, 2000)
  }

  const clearConversation = () => {
    setConversation([])
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  // Add initial AI greeting
  useEffect(() => {
    if (conversation.length === 0) {
      const greeting: ConversationMessage = {
        id: 'greeting',
        speaker: 'ai',
        message: "Welcome to ODEUO Voice AI! Click the microphone to start a conversation.",
        timestamp: new Date(),
        confidence: 1.0
      }
      setConversation([greeting])
    }
  }, [conversation.length])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎤 Voice AI Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recording Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={isProcessing}
            variant={isRecording ? "destructive" : "default"}
            size="lg"
            className="relative"
          >
            {isRecording ? (
              <>
                <div className="w-4 h-4 bg-white rounded-sm animate-pulse mr-2" />
                Stop Recording
              </>
            ) : isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                🎤 Start Recording
              </>
            )}
          </Button>
          
          {conversation.length > 1 && (
            <Button variant="outline" onClick={clearConversation}>
              Clear Chat
            </Button>
          )}
        </div>

        {/* Current Transcript */}
        {(isRecording || currentTranscript) && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">
              {isRecording ? 'Listening...' : 'Transcript:'}
            </div>
            <div className="font-medium">
              {currentTranscript || 'Speak now...'}
              {isRecording && <span className="animate-pulse">|</span>}
            </div>
          </div>
        )}

        {/* Conversation History */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {conversation.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg ${
                message.speaker === 'user'
                  ? 'bg-primary text-primary-foreground ml-8'
                  : 'bg-muted mr-8'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">
                  {message.speaker === 'user' ? '👤 You' : '🤖 AI Assistant'}
                </span>
                <div className="flex items-center gap-2 text-xs opacity-70">
                  {message.confidence && (
                    <span>{Math.round(message.confidence * 100)}%</span>
                  )}
                  <span>{formatTime(message.timestamp)}</span>
                </div>
              </div>
              <div className="text-sm">{message.message}</div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="p-3 rounded-lg bg-muted mr-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Demo Info */}
        <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
          <strong>Demo Features:</strong> Real-time speech recognition, AI response generation, 
          conversation history, and confidence scoring. In production, this would connect to 
          your LiveKit server for actual voice processing.
        </div>
      </CardContent>
    </Card>
  )
}
