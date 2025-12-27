'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase'
import type { Skill } from '@/types/database'
import { ArrowLeft, Code, Edit, Plus, Save, Star, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    proficiency_level: 0,
    years_of_experience: 0,
    is_visible: true,
  })

  // Common skill categories
  const skillCategories = [
    'Programming Languages',
    'Frontend Frameworks',
    'Backend Frameworks',
    'Databases',
    'Cloud Platforms',
    'DevOps & Tools',
    'Mobile Development',
    'Design Tools',
    'Other',
  ]

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true })

      if (error) throw error
      setSkills(data || [])
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      proficiency_level: 0,
      years_of_experience: 0,
      is_visible: true,
    })
    setEditingSkill(null)
  }

  const openForm = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill)
      setFormData({
        name: skill.name,
        category: skill.category || '',
        proficiency_level: skill.proficiency_level || 0,
        years_of_experience: skill.years_of_experience || 0,
        is_visible: skill.is_visible,
      })
    } else {
      resetForm()
    }
    setShowForm(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const dataToSave = {
        ...formData,
        user_id: user.id,
        category: formData.category || null,
        proficiency_level: formData.proficiency_level || null,
        years_of_experience: formData.years_of_experience || null,
      }

      if (editingSkill) {
        const { error } = await supabase.from('skills').update(dataToSave).eq('id', editingSkill.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('skills').insert([dataToSave])
        if (error) throw error
      }

      await fetchSkills()
      setShowForm(false)
      resetForm()
    } catch (error) {
      console.error('Error saving skill:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return

    try {
      const { error } = await supabase.from('skills').delete().eq('id', id)

      if (error) throw error
      await fetchSkills()
    } catch (error) {
      console.error('Error deleting skill:', error)
    }
  }

  const getProficiencyText = (level: number | null) => {
    if (!level) return ''
    if (level <= 2) return 'Beginner'
    if (level <= 4) return 'Intermediate'
    if (level <= 7) return 'Advanced'
    return 'Expert'
  }

  const getProficiencyColor = (level: number | null) => {
    if (!level) return 'bg-gray-100 text-gray-600'
    if (level <= 2) return 'bg-red-100 text-red-700'
    if (level <= 4) return 'bg-yellow-100 text-yellow-700'
    if (level <= 7) return 'bg-blue-100 text-blue-700'
    return 'bg-green-100 text-green-700'
  }

  // Group skills by category
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      const category = skill.category || 'Other'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>
  )

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
              <h1 className="text-xl font-semibold text-gray-900">Skills & Technologies Management</h1>
            </div>

            <Button onClick={() => openForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingSkill ? 'Edit' : 'Add'} Skill</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Skill Name *</label>
                  <Input
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="React, TypeScript, etc."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                  <select
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="">Select a category</option>
                    {skillCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Proficiency Level (1-10)</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.proficiency_level}
                    onChange={e => setFormData(prev => ({ ...prev, proficiency_level: parseInt(e.target.value) || 0 }))}
                    placeholder="1-10"
                  />
                  <p className="mt-1 text-xs text-gray-500">{getProficiencyText(formData.proficiency_level)}</p>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Years of Experience</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.years_of_experience}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, years_of_experience: parseInt(e.target.value) || 0 }))
                    }
                    placeholder="Years"
                  />
                </div>
              </div>

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

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving || !formData.name}>
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

        {skills.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Code className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No Skills Added</h3>
              <p className="mb-4 text-center text-gray-600">Get started by adding your first skill or technology.</p>
              <Button onClick={() => openForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category}>
                <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                  <Code className="mr-2 h-5 w-5" />
                  {category}
                  <Badge variant="secondary" className="ml-2">
                    {categorySkills.length}
                  </Badge>
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categorySkills.map(skill => (
                    <Card key={skill.id} className="transition-shadow hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-start justify-between">
                          <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                          <div className="flex items-center gap-1">
                            {!skill.is_visible && (
                              <Badge variant="secondary" className="text-xs">
                                Hidden
                              </Badge>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => openForm(skill)} className="h-8 w-8 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(skill.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {skill.proficiency_level && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Proficiency</span>
                              <Badge className={getProficiencyColor(skill.proficiency_level)}>
                                <Star className="mr-1 h-3 w-3" />
                                {skill.proficiency_level}/10 - {getProficiencyText(skill.proficiency_level)}
                              </Badge>
                            </div>
                          )}

                          {skill.years_of_experience && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Experience</span>
                              <span className="text-sm font-medium">
                                {skill.years_of_experience} {skill.years_of_experience === 1 ? 'year' : 'years'}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {skills.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Skills Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{skills.length}</div>
                  <div className="text-sm text-gray-600">Total Skills</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{skills.filter(s => s.is_visible).length}</div>
                  <div className="text-sm text-gray-600">Visible</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{Object.keys(skillsByCategory).length}</div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(
                      skills.reduce((acc, skill) => acc + (skill.years_of_experience || 0), 0) / skills.length
                    ) || 0}
                  </div>
                  <div className="text-sm text-gray-600">Avg. Years</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
