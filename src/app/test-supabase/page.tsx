'use client'

import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function TestSupabasePage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient()
        
        // Test the connection by trying to fetch from auth
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          setStatus('error')
          setMessage(`Connection error: ${error.message}`)
        } else {
          setStatus('success')
          setMessage('✅ Supabase connection successful!')
        }
      } catch (err) {
        setStatus('error')
        setMessage(`Connection failed: ${err}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>
        
        <div className="bg-card rounded-lg border p-6">
          {status === 'loading' && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Testing connection...</span>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-green-600">
              <h2 className="text-xl font-semibold mb-2">Connection Successful! 🎉</h2>
              <p>{message}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Your Supabase credentials are correctly configured.
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-red-600">
              <h2 className="text-xl font-semibold mb-2">Connection Failed ❌</h2>
              <p className="mb-2">{message}</p>
              <p className="text-sm text-muted-foreground">
                Please check your .env.local file and make sure you have:
              </p>
              <ul className="text-sm text-muted-foreground mt-1 list-disc list-inside">
                <li>NEXT_PUBLIC_SUPABASE_URL (no quotes)</li>
                <li>NEXT_PUBLIC_SUPABASE_ANON_KEY (no quotes)</li>
                <li>No extra spaces or characters</li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <a 
            href="/" 
            className="text-primary hover:underline"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
} 