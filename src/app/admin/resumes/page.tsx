import ResumeManager from '@/components/admin/ResumeManager'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function AdminResumesPage() {
  const supabase = await createServerSupabaseClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Fetch existing resume files
  const { data: resumeFiles, error } = await supabase
    .from('resume_files')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching resume files:', error)
  }

  return <ResumeManager user={user} initialFiles={resumeFiles || []} />
} 