'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface AgentStatusProps {
  agentId?: string
  className?: string
}

type AgentState = 'idle' | 'thinking' | 'working' | 'waiting' | 'error'

export function AgentStatus({ agentId = 'instify-agent', className }: AgentStatusProps) {
  const [state, setState] = useState<AgentState>('idle')
  const [message, setMessage] = useState('Agent is ready')
  const [progress, setProgress] = useState(0)

  // Simulate agent state changes for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const states: AgentState[] = ['idle', 'thinking', 'working', 'waiting']
      const randomState = states[Math.floor(Math.random() * states.length)]
      setState(randomState)
      
      switch (randomState) {
        case 'idle':
          setMessage('Agent is ready')
          setProgress(0)
          break
        case 'thinking':
          setMessage('Processing your request...')
          setProgress(25)
          break
        case 'working':
          setMessage('Executing automation workflow...')
          setProgress(75)
          break
        case 'waiting':
          setMessage('Waiting for user input...')
          setProgress(50)
          break
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (state: AgentState) => {
    switch (state) {
      case 'idle': return 'bg-gray-500'
      case 'thinking': return 'bg-blue-500 animate-pulse'
      case 'working': return 'bg-green-500 animate-pulse'
      case 'waiting': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const handleInterrupt = () => {
    setState('idle')
    setMessage('Agent interrupted by user')
    setProgress(0)
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(state)}`} />
          AG-UI Agent Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Agent ID:</span>
            <span className="font-mono text-xs">{agentId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>State:</span>
            <span className="capitalize font-medium">{state}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {message}
          </div>
        </div>
        
        {progress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {(state === 'working' || state === 'thinking') && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleInterrupt}
            className="w-full"
          >
            Interrupt Agent
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
