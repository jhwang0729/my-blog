'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import {
    BarChart3,
    Edit3,
    LogOut,
    Settings,
    Shield,
    Upload,
    User
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface AdminDashboardProps {
  user: SupabaseUser
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    try {
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const dashboardItems = [
    {
      title: 'Profile Management',
      description: 'Update your personal information and contact details',
      icon: User,
      href: '/admin/profile',
      color: 'bg-blue-500',
    },
    {
      title: 'Work Experience',
      description: 'Manage your work history and job details',
      icon: BarChart3,
      href: '/admin/experience',
      color: 'bg-green-500',
    },
    {
      title: 'Resume Files',
      description: 'Upload and manage downloadable resume files',
      icon: Upload,
      href: '/admin/resumes',
      color: 'bg-purple-500',
    },
    {
      title: 'Notes & Blog',
      description: 'Create and edit your notes and blog posts',
      icon: Edit3,
      href: '/admin/notes',
      color: 'bg-orange-500',
    },
    {
      title: 'Settings',
      description: 'Configure site settings and preferences',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user.email}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                    Signing out...
                  </div>
                ) : (
                  <>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Management</h2>
          <p className="text-gray-600">
            Manage your personal website content, resume files, and notes from this central dashboard.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dashboardItems.map((item) => {
            const Icon = item.icon
            return (
              <Card 
                key={item.href} 
                className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                onClick={() => router.push(item.href)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Resume Downloads</CardTitle>
              <div className="text-2xl font-bold">0</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Published Notes</CardTitle>
              <div className="text-2xl font-bold">0</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Page Views</CardTitle>
              <div className="text-2xl font-bold">0</div>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  )
} 