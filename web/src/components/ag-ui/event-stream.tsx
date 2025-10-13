'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface EventStreamProps {
  className?: string
}

interface AgentEvent {
  id: string
  type: 'message' | 'tool_call' | 'state_update' | 'thinking' | 'error' | 'interrupt'
  timestamp: Date
  data: any
  source: 'agent' | 'user' | 'system'
}

export function EventStream({ className }: EventStreamProps) {
  const [events, setEvents] = useState<AgentEvent[]>([])
  const [isStreaming, setIsStreaming] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Simulate AG-UI event stream
  useEffect(() => {
    if (!isStreaming) return

    const eventTypes: AgentEvent['type'][] = ['message', 'tool_call', 'state_update', 'thinking']
    const sources: AgentEvent['source'][] = ['agent', 'user', 'system']
    
    const interval = setInterval(() => {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      const source = sources[Math.floor(Math.random() * sources.length)]
      
      let data: any = {}
      
      switch (eventType) {
        case 'message':
          data = {
            content: source === 'agent' 
              ? 'Processing customer engagement workflow...' 
              : 'User requested automation status',
            role: source
          }
          break
        case 'tool_call':
          data = {
            tool: 'instagram_dm_sender',
            parameters: { recipient: 'customer_123', message: 'Hello!' },
            status: 'executing'
          }
          break
        case 'state_update':
          data = {
            key: 'active_conversations',
            value: Math.floor(Math.random() * 100),
            previous_value: Math.floor(Math.random() * 100)
          }
          break
        case 'thinking':
          data = {
            step: 'Analyzing customer sentiment...',
            confidence: Math.random()
          }
          break
      }

      const newEvent: AgentEvent = {
        id: Date.now().toString(),
        type: eventType,
        timestamp: new Date(),
        data,
        source
      }

      setEvents(prev => [...prev.slice(-19), newEvent]) // Keep last 20 events
    }, 2000)

    return () => clearInterval(interval)
  }, [isStreaming])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [events])

  const getEventIcon = (type: AgentEvent['type']) => {
    switch (type) {
      case 'message': return '💬'
      case 'tool_call': return '🔧'
      case 'state_update': return '📊'
      case 'thinking': return '🤔'
      case 'error': return '❌'
      case 'interrupt': return '⏸️'
      default: return '📝'
    }
  }

  const getSourceColor = (source: AgentEvent['source']) => {
    switch (source) {
      case 'agent': return 'text-blue-600 dark:text-blue-400'
      case 'user': return 'text-green-600 dark:text-green-400'
      case 'system': return 'text-orange-600 dark:text-orange-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const formatEventData = (event: AgentEvent) => {
    switch (event.type) {
      case 'message':
        return event.data.content
      case 'tool_call':
        return `${event.data.tool}(${JSON.stringify(event.data.parameters)})`
      case 'state_update':
        return `${event.data.key}: ${event.data.previous_value} → ${event.data.value}`
      case 'thinking':
        return `${event.data.step} (${Math.round(event.data.confidence * 100)}%)`
      default:
        return JSON.stringify(event.data)
    }
  }

  const clearEvents = () => {
    setEvents([])
  }

  const toggleStreaming = () => {
    setIsStreaming(!isStreaming)
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isStreaming ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            AG-UI Event Stream
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={toggleStreaming}>
              {isStreaming ? 'Pause' : 'Resume'}
            </Button>
            <Button variant="outline" size="sm" onClick={clearEvents}>
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={scrollRef}
          className="h-64 overflow-y-auto space-y-2 border rounded p-2 bg-muted/20"
        >
          {events.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              {isStreaming ? 'Waiting for events...' : 'Event stream paused'}
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="text-xs space-y-1 p-2 border rounded bg-background">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{getEventIcon(event.type)}</span>
                    <span className="font-medium">{event.type}</span>
                    <span className={`text-xs ${getSourceColor(event.source)}`}>
                      {event.source}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {event.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit', 
                      second: '2-digit' 
                    })}
                  </span>
                </div>
                <div className="text-muted-foreground font-mono text-xs break-all">
                  {formatEventData(event)}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {events.length} events • {isStreaming ? 'Streaming' : 'Paused'}
        </div>
      </CardContent>
    </Card>
  )
}
