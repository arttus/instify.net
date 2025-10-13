'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();

  // Redirect to sign-in page after a short delay to show the message
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/sign-in');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Instify Admin</h1>
        <p className="text-muted-foreground mt-2">
          Registration is currently disabled
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Registration Unavailable</CardTitle>
          <CardDescription className="text-center">
            New admin accounts are not available for public registration
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              🔒 Admin access is restricted. Contact your system administrator to request access.
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            You will be redirected to the sign-in page in a few seconds...
          </p>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/sign-in">Go to Sign In</Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
