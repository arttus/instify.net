import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CustomersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Customer Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage your customers and their engagement across all channels
        </p>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+180 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-muted-foreground">16% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Multi-Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">Using 2+ channels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Voice Enabled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">789</div>
            <p className="text-xs text-muted-foreground">28% adoption</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Customers</CardTitle>
          <CardDescription>
            Latest customer registrations and activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: 'Sarah Johnson',
                email: 'sarah@example.com',
                channels: ['Instagram', 'Voice'],
                status: 'Active',
                lastSeen: '2 hours ago'
              },
              {
                name: 'Mike Chen',
                email: 'mike@example.com',
                channels: ['SMS', 'WhatsApp', 'Voice'],
                status: 'Active',
                lastSeen: '5 hours ago'
              },
              {
                name: 'Emma Davis',
                email: 'emma@example.com',
                channels: ['Instagram', 'SMS'],
                status: 'Inactive',
                lastSeen: '2 days ago'
              },
              {
                name: 'Alex Rodriguez',
                email: 'alex@example.com',
                channels: ['WhatsApp', 'Voice'],
                status: 'Active',
                lastSeen: '1 hour ago'
              },
              {
                name: 'Lisa Wang',
                email: 'lisa@example.com',
                channels: ['Instagram', 'SMS', 'Voice'],
                status: 'Active',
                lastSeen: '30 minutes ago'
              }
            ].map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex gap-1">
                    {customer.channels.map((channel, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                  <Badge variant={customer.status === 'Active' ? 'default' : 'secondary'}>
                    {customer.status}
                  </Badge>
                  <div className="text-sm text-muted-foreground min-w-[100px] text-right">
                    {customer.lastSeen}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-muted-foreground">
              Showing 5 of 2,847 customers
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
