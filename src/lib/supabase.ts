import type { Database } from '@/types/database'
import { createBrowserClient } from '@supabase/ssr'

// Client-side Supabase client (for use in client components)
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
