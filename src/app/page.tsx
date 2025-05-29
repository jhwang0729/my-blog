import About from '@/components/portfolio/About'
import Contact from '@/components/portfolio/Contact'
import Experience from '@/components/portfolio/Experience'
import Hero from '@/components/portfolio/Hero'
import Navigation from '@/components/portfolio/Navigation'
import ResumeSection from '@/components/portfolio/ResumeSection'
import Skills from '@/components/portfolio/Skills'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()

  // Get profile data
  const { data: profile } = await supabase.from('profiles').select('*').single()

  // Get work experiences
  const { data: experiences } = await supabase
    .from('work_experiences')
    .select('*')
    .eq('is_visible', true)
    .order('display_order', { ascending: true })

  // Get skills
  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .eq('is_visible', true)
    .order('name', { ascending: true })

  // Get public resume files
  const { data: resumeFiles } = await supabase
    .from('resume_files')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-portfolio min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <Hero profile={profile} />

      {/* About Section */}
      <About profile={profile} />

      {/* Experience Section */}
      <Experience experiences={experiences || []} />

      {/* Skills Section */}
      <Skills skills={skills || []} />

      {/* Resume Download Section */}
      <ResumeSection resumeFiles={resumeFiles || []} />

      {/* Contact Section */}
      <Contact profile={profile} />
    </div>
  )
}
