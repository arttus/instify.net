'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function AdminPage() {
  const { user } = useUser();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.firstName || 'Admin'}!</h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s what&apos;s happening with your Instify platform today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Badge variant="secondary">+12%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+180 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
            <Badge variant="default">Live</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">Across all channels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Response Rate</CardTitle>
            <Badge variant="default">98.5%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voice Sessions</CardTitle>
            <Badge variant="secondary">+8%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Voice AI Management</CardTitle>
            <CardDescription>
              Manage LiveKit agents and voice processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>LiveKit Server</span>
              <Badge variant="default">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Voice Agents</span>
              <Badge variant="default">3 Active</Badge>
            </div>
            <Button asChild className="w-full">
              <Link href="/livekit-demo">Test Voice AI</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AG-UI Protocol</CardTitle>
            <CardDescription>
              Agent-User Interaction management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Protocol Status</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Connected Agents</span>
              <Badge variant="secondary">12</Badge>
            </div>
            <Button asChild className="w-full">
              <Link href="/ag-ui-demo">Test AG-UI</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workflow Automation</CardTitle>
            <CardDescription>
              n8n workflow management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Active Workflows</span>
              <Badge variant="default">8</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Executions Today</span>
              <Badge variant="secondary">1,247</Badge>
            </div>
            <Button asChild className="w-full">
              <Link href="/n8n" target="_blank">Open n8n</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Current status of all platform services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Web App', status: 'Online' },
              { name: 'Database', status: 'Online' },
              { name: 'Redis', status: 'Online' },
              { name: 'LiveKit', status: 'Online' },
              { name: 'n8n', status: 'Online' },
              { name: 'Nginx', status: 'Online' },
              { name: 'Voice AI', status: 'Online' },
              { name: 'AG-UI', status: 'Online' },
            ].map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">{service.name}</span>
                <Badge variant="default">{service.status}</Badge>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-6">
            <Button variant="outline" asChild>
              <Link href="/api/health">Health Check</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/api/metrics">View Metrics</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
