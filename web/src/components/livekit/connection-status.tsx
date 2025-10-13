'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ConnectionStatusProps {
  className?: string
}

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error'

export function ConnectionStatus({ className }: ConnectionStatusProps) {
  const [state, setState] = useState<ConnectionState>('disconnected')
  const [serverUrl, setServerUrl] = useState('ws://localhost:7880')
  const [roomName, setRoomName] = useState('demo-room')
  const [participantName, setParticipantName] = useState('user-' + Math.floor(Math.random() * 1000))

  const getStatusColor = (state: ConnectionState) => {
    switch (state) {
      case 'disconnected': return 'bg-gray-500'
      case 'connecting': return 'bg-yellow-500 animate-pulse'
      case 'connected': return 'bg-green-500'
      case 'reconnecting': return 'bg-orange-500 animate-pulse'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusMessage = (state: ConnectionState) => {
    switch (state) {
      case 'disconnected': return 'Not connected to LiveKit server'
      case 'connecting': return 'Connecting to LiveKit server...'
      case 'connected': return 'Connected to LiveKit server'
      case 'reconnecting': return 'Reconnecting to LiveKit server...'
      case 'error': return 'Failed to connect to LiveKit server'
      default: return 'Unknown connection state'
    }
  }

  const handleConnect = async () => {
    setState('connecting')
    
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // For demo purposes, randomly succeed or fail
      if (Math.random() > 0.2) {
        setState('connected')
      } else {
        setState('error')
      }
    } catch (error) {
      console.error('Connection failed:', error)
      setState('error')
    }
  }

  const handleDisconnect = () => {
    setState('disconnected')
  }

  const handleReconnect = async () => {
    setState('reconnecting')
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setState('connected')
    } catch (error) {
      console.error('Reconnection failed:', error)
      setState('error')
    }
  }

  // Simulate periodic reconnection attempts when in error state
  useEffect(() => {
    if (state === 'error') {
      const timeout = setTimeout(() => {
        handleReconnect()
      }, 5000)
      
      return () => clearTimeout(timeout)
    }
  }, [state])

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(state)}`} />
          LiveKit Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Server URL:</span>
            <span className="font-mono text-xs">{serverUrl}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Room:</span>
            <span className="font-medium">{roomName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Participant:</span>
            <span className="font-medium">{participantName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Status:</span>
            <span className="capitalize font-medium">{state}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {getStatusMessage(state)}
          </div>
        </div>

        <div className="flex gap-2">
          {state === 'disconnected' && (
            <Button onClick={handleConnect} className="flex-1">
              Connect
            </Button>
          )}
          
          {state === 'connected' && (
            <>
              <Button variant="outline" onClick={handleReconnect} className="flex-1">
                Reconnect
              </Button>
              <Button variant="destructive" onClick={handleDisconnect} className="flex-1">
                Disconnect
              </Button>
            </>
          )}
          
          {(state === 'connecting' || state === 'reconnecting') && (
            <Button disabled className="flex-1">
              {state === 'connecting' ? 'Connecting...' : 'Reconnecting...'}
            </Button>
          )}
          
          {state === 'error' && (
            <Button variant="outline" onClick={handleReconnect} className="flex-1">
              Retry Connection
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          {state === 'error' && 'Auto-retry in 5 seconds...'}
          {state === 'connected' && 'Ready for voice/video calls'}
        </div>
      </CardContent>
    </Card>
  )
}
