import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your Instify platform settings and integrations
        </p>
      </div>

      {/* AI Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>AI Configuration</CardTitle>
          <CardDescription>
            Configure AI models and voice processing settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Speech-to-Text Provider</Label>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">AssemblyAI</div>
                <div className="text-sm text-muted-foreground">Universal Streaming</div>
                <Badge variant="default" className="mt-1">Active</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Language Model</Label>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">OpenAI GPT-4.1 mini</div>
                <div className="text-sm text-muted-foreground">Advanced reasoning</div>
                <Badge variant="default" className="mt-1">Active</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Text-to-Speech Provider</Label>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Cartesia Sonic-2</div>
                <div className="text-sm text-muted-foreground">Ultra-low latency</div>
                <Badge variant="default" className="mt-1">Active</Badge>
              </div>
            </div>
          </div>
          <Button>Update AI Configuration</Button>
        </CardContent>
      </Card>

      {/* Service Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Service Integrations</CardTitle>
          <CardDescription>
            Manage external service connections and API keys
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { name: 'OpenAI', status: 'Connected', description: 'AI language models' },
            { name: 'Clerk', status: 'Connected', description: 'Authentication service' },
            { name: 'LiveKit', status: 'Connected', description: 'Voice and video platform' },
            { name: 'AssemblyAI', status: 'Connected', description: 'Speech recognition' },
            { name: 'Cartesia', status: 'Connected', description: 'Text-to-speech' },
            { name: 'Anthropic', status: 'Optional', description: 'Alternative AI models' },
          ].map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  {service.name[0]}
                </div>
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={service.status === 'Connected' ? 'default' : 'secondary'}>
                  {service.status}
                </Badge>
                <Button variant="ghost" size="sm">Configure</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>
            Configure system behavior and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Voice AI Auto-Response</Label>
              <div className="text-sm text-muted-foreground">
                Automatically respond to voice interactions
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Multi-language Support</Label>
              <div className="text-sm text-muted-foreground">
                Enable automatic language detection
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Analytics Collection</Label>
              <div className="text-sm text-muted-foreground">
                Collect conversation analytics and metrics
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Debug Logging</Label>
              <div className="text-sm text-muted-foreground">
                Enable detailed system logging
              </div>
            </div>
            <Switch />
          </div>
          
          <Button>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
