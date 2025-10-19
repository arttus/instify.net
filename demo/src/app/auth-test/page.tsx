'use client'

import { useAuth, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function AuthTestPage() {
  const { isSignedIn, isLoaded, userId } = useAuth()
  const { user } = useUser()

  if (!isLoaded) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
          <CardDescription>
            This page shows the current authentication status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Is Signed In:</strong> {isSignedIn ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Is Loaded:</strong> {isLoaded ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>User ID:</strong> {userId || 'None'}
          </div>
          <div>
            <strong>User Email:</strong> {user?.emailAddresses[0]?.emailAddress || 'None'}
          </div>
          <div>
            <strong>User Name:</strong> {user?.fullName || 'None'}
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button asChild>
              <Link href="/admin">Admin</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
