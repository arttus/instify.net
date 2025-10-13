import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Logo/Brand */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Instify
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          {/* Coming Soon Message */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 dark:text-slate-200">
              Coming Soon
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              We're building something amazing. Our AI-powered customer engagement platform
              will revolutionize how businesses connect with their customers across multiple channels.
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">AI Automation</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Intelligent customer conversations powered by advanced AI
              </p>
            </div>
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Multi-Channel</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Instagram, SMS, WhatsApp, and voice in one platform
              </p>
            </div>
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-3xl mb-3">🏢</div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Enterprise Ready</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Secure, scalable multi-tenant architecture
              </p>
            </div>
          </div>

          {/* Admin Access */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
              Platform administrators can access the dashboard
            </p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
              <Link href="/sign-in">Admin Dashboard</Link>
            </Button>
          </div>

          {/* Footer */}
          <div className="pt-8 text-xs text-slate-400 dark:text-slate-600">
            © 2024 Instify. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
