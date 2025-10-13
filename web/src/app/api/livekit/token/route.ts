import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { roomName, participantName } = body

    if (!roomName || !participantName) {
      return NextResponse.json(
        { error: 'roomName and participantName are required' },
        { status: 400 }
      )
    }

    // For now, return a mock token structure
    // In production, this would use the LiveKit server SDK to generate real tokens
    const mockToken = {
      token: `mock_token_${Date.now()}`,
      roomName,
      participantName,
      serverUrl: process.env.LIVEKIT_URL || 'ws://localhost:7880',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    }

    console.log('LiveKit Token Request:', {
      roomName,
      participantName,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(mockToken)
  } catch (error) {
    console.error('LiveKit Token Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate token',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
