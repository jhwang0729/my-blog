'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase'
import type { Project, WorkExperience } from '@/types/database'
import { ArrowLeft, Briefcase, Calendar, Edit, ExternalLink, Github, MapPin, Plus, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type WorkExperienceWithProjects = WorkExperience & {
  projects: Project[]
}

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<WorkExperienceWithProjects[]>([])
  const [loading, setLoading] = useState(true)
  const [editingExperience, setEditingExperience] = useState<WorkExperienceWithProjects | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  // Form state for work experience
  const [formData, setFormData] = useState({
    company_name: '',
    job_title: '',
    employment_type: '',
    location: '',
    start_date: '',
    end_date: '',
    technologies: '',
    is_visible: true,
    display_order: 0,
  })

  // Project form type with string for technologies (form input)
  type ProjectForm = {
    id?: string
    title: string
    description: string | null
    technologies: string // comma-separated string for form input
    start_date: string | null
    end_date: string | null
    project_url: string | null
    github_url: string | null
    display_order: number
    is_visible: boolean
  }

  // Projects state
  const [projects, setProjects] = useState<ProjectForm[]>([])

  // Employment types
  const employmentTypes = ['Full-time', 'Part-time', 'Intern', 'Contract', 'Freelance', 'Volunteer']

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const { data: experiencesData, error: expError } = await supabase
        .from('work_experiences')
        .select('*')
        .order('display_order', { ascending: true })

      if (expError) throw expError

      // Fetch projects for each experience
      const experiencesWithProjects = await Promise.all(
        (experiencesData || []).map(async exp => {
          const { data: projectsData, error: projError } = await supabase
            .from('projects')
            .select('*')
            .eq('work_experience_id', exp.id)
            .order('display_order', { ascending: true })

          if (projError) throw projError
          return { ...exp, projects: projectsData || [] }
        })
      )

      setExperiences(experiencesWithProjects)
    } catch (error) {
      console.error('Error fetching experiences:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      company_name: '',
      job_title: '',
      employment_type: '',
      location: '',
      start_date: '',
      end_date: '',
      technologies: '',
      is_visible: true,
      display_order: experiences.length,
    })
    setProjects([])
    setEditingExperience(null)
  }

  const openForm = (experience?: WorkExperienceWithProjects) => {
    if (experience) {
      setEditingExperience(experience)
      setFormData({
        company_name: experience.company_name,
        job_title: experience.job_title,
        employment_type: experience.employment_type || '',
        location: experience.location || '',
        start_date: experience.start_date || '',
        end_date: experience.end_date || '',
        technologies: Array.isArray(experience.technologies) ? experience.technologies.join(', ') : '',
        is_visible: experience.is_visible,
        display_order: experience.display_order,
      })
      setProjects(
        experience.projects.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : '',
          start_date: p.start_date,
          end_date: p.end_date,
          project_url: p.project_url,
          github_url: p.github_url,
          display_order: p.display_order,
          is_visible: p.is_visible,
        }))
      )
    } else {
      resetForm()
    }
    setShowForm(true)
  }

  const addProject = () => {
    setProjects(prev => [
      ...prev,
      {
        title: '',
        description: '',
        technologies: '',
        start_date: '',
        end_date: '',
        project_url: '',
        github_url: '',
        display_order: prev.length,
        is_visible: true,
      },
    ])
  }

  const updateProject = (index: number, field: keyof ProjectForm, value: string | number | boolean | null) => {
    setProjects(prev => prev.map((project, i) => (i === index ? { ...project, [field]: value } : project)))
  }

  const removeProject = (index: number) => {
    setProjects(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Convert technologies string to array
      const technologiesArray = formData.technologies
        ? formData.technologies
            .split(',')
            .map(tech => tech.trim())
            .filter(tech => tech.length > 0)
        : null

      const experienceData = {
        ...formData,
        user_id: user.id,
        start_date: formData.start_date || new Date().toISOString().split('T')[0],
        end_date: formData.end_date || null,
        location: formData.location || null,
        employment_type: formData.employment_type || null,
        technologies: technologiesArray,
        description: null, // Remove description field
      }

      let experienceId: string

      if (editingExperience) {
        const { error } = await supabase.from('work_experiences').update(experienceData).eq('id', editingExperience.id)
        if (error) throw error
        experienceId = editingExperience.id

        // Delete existing projects for this experience
        await supabase.from('projects').delete().eq('work_experience_id', experienceId)
      } else {
        const { data, error } = await supabase.from('work_experiences').insert([experienceData]).select()
        if (error) throw error
        experienceId = data[0].id
      }

      // Save projects
      if (projects.length > 0) {
        const projectsToSave = projects
          .filter(p => p.title && p.title.trim())
          .map((project, index) => ({
            user_id: user.id,
            work_experience_id: experienceId,
            title: project.title!,
            description: project.description || null,
            technologies: project.technologies
              ? project.technologies
                  .split(',')
                  .map((tech: string) => tech.trim())
                  .filter(Boolean)
              : null,
            start_date: project.start_date || null,
            end_date: project.end_date || null,
            project_url: project.project_url || null,
            github_url: project.github_url || null,
            display_order: index,
            is_visible: project.is_visible ?? true,
          }))

        if (projectsToSave.length > 0) {
          const { error: projectError } = await supabase.from('projects').insert(projectsToSave)
          if (projectError) throw projectError
        }
      }

      await fetchExperiences()
      setShowForm(false)
      resetForm()
    } catch (error) {
      console.error('Error saving experience:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this work experience and all its projects?')) return

    try {
      // Delete projects first (foreign key constraint)
      await supabase.from('projects').delete().eq('work_experience_id', id)

      // Then delete experience
      const { error } = await supabase.from('work_experiences').delete().eq('id', id)

      if (error) throw error
      await fetchExperiences()
    } catch (error) {
      console.error('Error deleting experience:', error)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present'
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Work Experience Management</h1>
            </div>

            <Button onClick={() => openForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingExperience ? 'Edit' : 'Add'} Work Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Company Name *</label>
                  <Input
                    value={formData.company_name}
                    onChange={e => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Job Title *</label>
                  <Input
                    value={formData.job_title}
                    onChange={e => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
                    placeholder="Software Engineer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Employment Type</label>
                  <select
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.employment_type}
                    onChange={e => setFormData(prev => ({ ...prev, employment_type: e.target.value }))}
                  >
                    <option value="">Select employment type</option>
                    {employmentTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
                  <Input
                    value={formData.location}
                    onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Start Date</label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={e => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">End Date</label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={e => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    placeholder="Leave blank if current position"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Technologies (comma-separated)</label>
                <Input
                  value={formData.technologies}
                  onChange={e => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
                  placeholder="React, TypeScript, Node.js, PostgreSQL"
                />
              </div>

              {/* Projects Section */}
              <div className="border-t pt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
                  <Button variant="outline" onClick={addProject}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                </div>

                {projects.map((project, index) => (
                  <Card key={index} className="mb-4 bg-gray-50">
                    <CardContent className="space-y-4 p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Project {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProject(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-600">Project Title *</label>
                          <Input
                            value={project.title || ''}
                            onChange={e => updateProject(index, 'title', e.target.value)}
                            placeholder="E-commerce Platform"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-600">Technologies</label>
                          <Input
                            value={project.technologies || ''}
                            onChange={e => updateProject(index, 'technologies', e.target.value)}
                            placeholder="React, Node.js, MongoDB"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">Description</label>
                        <textarea
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={project.description || ''}
                          onChange={e => updateProject(index, 'description', e.target.value)}
                          placeholder="Brief description of the project..."
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-600">Project URL</label>
                          <Input
                            value={project.project_url || ''}
                            onChange={e => updateProject(index, 'project_url', e.target.value)}
                            placeholder="https://example.com"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-600">GitHub URL</label>
                          <Input
                            value={project.github_url || ''}
                            onChange={e => updateProject(index, 'github_url', e.target.value)}
                            placeholder="https://github.com/username/repo"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_visible"
                    checked={formData.is_visible}
                    onChange={e => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="is_visible" className="text-sm font-medium text-gray-700">
                    Visible on portfolio
                  </label>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Display Order</label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={e => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving || !formData.company_name || !formData.job_title}>
                  {saving ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {experiences.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No Work Experience</h3>
              <p className="mb-4 text-center text-gray-600">Get started by adding your first work experience.</p>
              <Button onClick={() => openForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Experience
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {experiences.map(experience => (
              <Card key={experience.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{experience.job_title}</CardTitle>
                      <CardDescription className="text-base font-medium text-blue-600">
                        {experience.company_name}
                      </CardDescription>
                      {experience.employment_type && (
                        <Badge variant="outline" className="mt-2">
                          <Briefcase className="mr-1 h-3 w-3" />
                          {experience.employment_type}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!experience.is_visible && <Badge variant="secondary">Hidden</Badge>}
                      <Button variant="outline" size="sm" onClick={() => openForm(experience)}>
                        <Edit className="mr-1 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(experience.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {formatDate(experience.start_date)} - {formatDate(experience.end_date)}
                      </div>
                      {experience.location && (
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-4 w-4" />
                          {experience.location}
                        </div>
                      )}
                    </div>

                    {experience.technologies && Array.isArray(experience.technologies) && (
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech, index) => (
                          <Badge key={index} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Projects */}
                    {experience.projects.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="mb-3 font-semibold text-gray-900">Projects ({experience.projects.length})</h4>
                        <div className="grid gap-3 md:grid-cols-2">
                          {experience.projects.map(project => (
                            <Card key={project.id} className="bg-gray-50">
                              <CardContent className="p-3">
                                <div className="mb-2 flex items-start justify-between">
                                  <h5 className="font-medium text-gray-900">{project.title}</h5>
                                  <div className="flex gap-1">
                                    {project.project_url && (
                                      <a
                                        href={project.project_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700"
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    )}
                                    {project.github_url && (
                                      <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 hover:text-gray-700"
                                      >
                                        <Github className="h-3 w-3" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                                {project.description && (
                                  <p className="mb-2 text-xs text-gray-600">{project.description}</p>
                                )}
                                {project.technologies && Array.isArray(project.technologies) && (
                                  <div className="flex flex-wrap gap-1">
                                    {project.technologies.map((tech, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {tech}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
