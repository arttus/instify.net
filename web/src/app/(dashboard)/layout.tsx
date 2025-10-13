import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { AdminGuard } from '@/components/auth/admin-guard';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        {/* Navigation Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Link href="/admin" className="text-2xl font-bold">
                  Instify Admin
                </Link>
                <nav className="hidden md:flex items-center space-x-4">
                  <Button variant="ghost" asChild>
                    <Link href="/admin">Dashboard</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href="/admin/customers">Customers</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href="/admin/conversations">Conversations</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href="/admin/automation">Automation</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href="/admin/analytics">Analytics</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href="/admin/settings">Settings</Link>
                  </Button>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" asChild>
                  <Link href="/livekit-demo">Voice AI Demo</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/ag-ui-demo">AG-UI Demo</Link>
                </Button>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'w-8 h-8'
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
