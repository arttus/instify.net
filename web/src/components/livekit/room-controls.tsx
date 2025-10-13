'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface RoomControlsProps {
  className?: string
}

interface Participant {
  id: string
  name: string
  isLocal: boolean
  audioEnabled: boolean
  videoEnabled: boolean
  connectionQuality: 'excellent' | 'good' | 'poor'
  joinedAt: Date
}

export function RoomControls({ className }: RoomControlsProps) {
  const [roomName, setRoomName] = useState('demo-room')
  const [participantName, setParticipantName] = useState('user-' + Math.floor(Math.random() * 1000))
  const [isInRoom, setIsInRoom] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [participants, setParticipants] = useState<Participant[]>([])

  const handleJoinRoom = async () => {
    try {
      // Simulate joining room
      setIsInRoom(true)
      
      // Add local participant
      const localParticipant: Participant = {
        id: 'local',
        name: participantName,
        isLocal: true,
        audioEnabled,
        videoEnabled,
        connectionQuality: 'excellent',
        joinedAt: new Date()
      }
      
      // Add some mock remote participants
      const remoteParticipants: Participant[] = [
        {
          id: 'remote-1',
          name: 'AI Assistant',
          isLocal: false,
          audioEnabled: true,
          videoEnabled: false,
          connectionQuality: 'excellent',
          joinedAt: new Date(Date.now() - 30000)
        },
        {
          id: 'remote-2',
          name: 'Customer Support',
          isLocal: false,
          audioEnabled: true,
          videoEnabled: true,
          connectionQuality: 'good',
          joinedAt: new Date(Date.now() - 60000)
        }
      ]
      
      setParticipants([localParticipant, ...remoteParticipants])
    } catch (error) {
      console.error('Failed to join room:', error)
    }
  }

  const handleLeaveRoom = () => {
    setIsInRoom(false)
    setParticipants([])
  }

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
    // Update local participant
    setParticipants(prev => prev.map(p => 
      p.isLocal ? { ...p, audioEnabled: !audioEnabled } : p
    ))
  }

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled)
    // Update local participant
    setParticipants(prev => prev.map(p => 
      p.isLocal ? { ...p, videoEnabled: !videoEnabled } : p
    ))
  }

  const getQualityColor = (quality: Participant['connectionQuality']) => {
    switch (quality) {
      case 'excellent': return 'text-green-600 dark:text-green-400'
      case 'good': return 'text-yellow-600 dark:text-yellow-400'
      case 'poor': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const formatDuration = (joinedAt: Date) => {
    const seconds = Math.floor((Date.now() - joinedAt.getTime()) / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎙️ Room Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isInRoom ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room-name">Room Name</Label>
              <Input
                id="room-name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="participant-name">Your Name</Label>
              <Input
                id="participant-name"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            
            <Button onClick={handleJoinRoom} className="w-full">
              Join Room
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Room: {roomName}</div>
                <div className="text-sm text-muted-foreground">
                  {participants.length} participant{participants.length !== 1 ? 's' : ''}
                </div>
              </div>
              <Button variant="destructive" size="sm" onClick={handleLeaveRoom}>
                Leave Room
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={audioEnabled ? "default" : "outline"}
                size="sm"
                onClick={toggleAudio}
                className="flex-1"
              >
                {audioEnabled ? '🎤 Mute' : '🔇 Unmute'}
              </Button>
              <Button
                variant={videoEnabled ? "default" : "outline"}
                size="sm"
                onClick={toggleVideo}
                className="flex-1"
              >
                {videoEnabled ? '📹 Stop Video' : '📷 Start Video'}
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Participants</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-2 border rounded text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className={participant.audioEnabled ? 'text-green-500' : 'text-gray-400'}>
                          🎤
                        </span>
                        <span className={participant.videoEnabled ? 'text-green-500' : 'text-gray-400'}>
                          📹
                        </span>
                      </div>
                      <span className="font-medium">
                        {participant.name}
                        {participant.isLocal && ' (You)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={getQualityColor(participant.connectionQuality)}>
                        {participant.connectionQuality}
                      </span>
                      <span className="text-muted-foreground">
                        {formatDuration(participant.joinedAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
