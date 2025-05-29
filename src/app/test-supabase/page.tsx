'use client'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function TestSupabasePage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [tableTests, setTableTests] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient()
        
        // Test 1: Basic connection
        const { error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          setStatus('error')
          setMessage(`Connection error: ${sessionError.message}`)
          return
        }

        // Test 2: Database tables
        const tests: {[key: string]: boolean} = {}
        
        // Test profiles table
        try {
          const { error: profilesError } = await supabase
            .from('profiles')
            .select('id')
            .limit(1)
          tests.profiles = !profilesError
        } catch {
          tests.profiles = false
        }

        // Test notes table
        try {
          const { error: notesError } = await supabase
            .from('notes')
            .select('id')
            .limit(1)
          tests.notes = !notesError
        } catch {
          tests.notes = false
        }

        // Test resume_files table
        try {
          const { error: resumeError } = await supabase
            .from('resume_files')
            .select('id')
            .limit(1)
          tests.resume_files = !resumeError
        } catch {
          tests.resume_files = false
        }

        // Test work_experiences table
        try {
          const { error: workError } = await supabase
            .from('work_experiences')
            .select('id')
            .limit(1)
          tests.work_experiences = !workError
        } catch {
          tests.work_experiences = false
        }

        setTableTests(tests)

        const allTablesWork = Object.values(tests).every(Boolean)
        if (allTablesWork) {
          setStatus('success')
          setMessage('✅ Supabase connection and all tables working!')
        } else {
          setStatus('error')
          setMessage('⚠️ Some database tables are missing or inaccessible')
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
              <span>Testing connection and database tables...</span>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-green-600">
              <h2 className="text-xl font-semibold mb-2">All Tests Passed! 🎉</h2>
              <p>{message}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Your Supabase credentials and database schema are correctly configured.
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-red-600">
              <h2 className="text-xl font-semibold mb-2">Issues Found ❌</h2>
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

          {/* Table Test Results */}
          {Object.keys(tableTests).length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Database Table Tests:</h3>
              <div className="space-y-1">
                {Object.entries(tableTests).map(([table, success]) => (
                  <div key={table} className="flex items-center space-x-2">
                    <span className={success ? 'text-green-600' : 'text-red-600'}>
                      {success ? '✅' : '❌'}
                    </span>
                    <span className="text-sm">{table}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <Link 
            href="/" 
            className="text-primary hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
} 