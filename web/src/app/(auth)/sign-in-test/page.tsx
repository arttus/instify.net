'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function SignInTestPage() {
  return (
    <div className="flex flex-col items-center space-y-6 p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Instify Admin</h1>
        <p className="text-muted-foreground mt-2">
          Sign in to access the admin dashboard
        </p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@instify.ai"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Admin access only. Contact your administrator for account access.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
