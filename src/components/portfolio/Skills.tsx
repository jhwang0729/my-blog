'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Skill } from '@/types/database'
import { motion } from 'framer-motion'
import { BookOpen, Code, Database, Globe, Star, Wrench } from 'lucide-react'

interface SkillsProps {
  skills: Skill[]
}

const Skills = ({ skills }: SkillsProps) => {
  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  // Category icons and colors
  const categoryConfig = {
    programming: { 
      icon: Code, 
      color: 'blue',
      bgClass: 'from-blue-50 to-indigo-50',
      borderClass: 'border-blue-200/50',
      iconClass: 'text-blue-600'
    },
    languages: { 
      icon: Globe, 
      color: 'green',
      bgClass: 'from-green-50 to-emerald-50',
      borderClass: 'border-green-200/50',
      iconClass: 'text-green-600'
    },
    tools: { 
      icon: Wrench, 
      color: 'purple',
      bgClass: 'from-purple-50 to-violet-50',
      borderClass: 'border-purple-200/50',
      iconClass: 'text-purple-600'
    },
    frameworks: { 
      icon: Database, 
      color: 'orange',
      bgClass: 'from-orange-50 to-red-50',
      borderClass: 'border-orange-200/50',
      iconClass: 'text-orange-600'
    },
    other: { 
      icon: BookOpen, 
      color: 'gray',
      bgClass: 'from-gray-50 to-slate-50',
      borderClass: 'border-gray-200/50',
      iconClass: 'text-gray-600'
    }
  }

  const getProficiencyStars = (level: number | null) => {
    const stars = level || 3 // Default to 3 if not specified
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={`${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const getExperienceText = (years: number | null) => {
    if (!years) return 'Learning'
    if (years < 1) return 'Beginner'
    if (years < 2) return '1 year'
    if (years < 5) return `${years} years`
    return 'Expert'
  }

  return (
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-4">
              <Code className="text-blue-600 mr-3" size={32} />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Skills & Technologies
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A comprehensive overview of my technical skills and expertise
            </p>
          </motion.div>

          {/* Skills Grid by Category */}
          <div className="space-y-12">
            {Object.entries(skillsByCategory).map(([category, categorySkills], categoryIndex) => {
              const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.other
              const IconComponent = config.icon

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Category Header */}
                  <div className="flex items-center mb-8">
                    <div className={`p-3 rounded-full bg-gradient-to-br ${config.bgClass} border ${config.borderClass} mr-4`}>
                      <IconComponent className={config.iconClass} size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 capitalize">
                        {category === 'other' ? 'Other Skills' : category}
                      </h3>
                      <p className="text-gray-600">
                        {categorySkills.length} skill{categorySkills.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categorySkills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: skillIndex * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05 }}
                        className="group"
                      >
                        <Card className={`bg-gradient-to-br ${config.bgClass} border ${config.borderClass} hover:shadow-lg transition-all duration-300 group-hover:shadow-xl`}>
                          <CardContent className="p-6">
                            {/* Skill Name */}
                            <h4 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                              {skill.name}
                            </h4>

                            {/* Proficiency Stars */}
                            <div className="flex items-center space-x-1 mb-3">
                              {getProficiencyStars(skill.proficiency_level)}
                            </div>

                            {/* Experience Badge */}
                            <div className="flex items-center justify-between">
                              <Badge 
                                variant="secondary" 
                                className={`text-xs bg-white/60 ${config.iconClass} border-white/30`}
                              >
                                {getExperienceText(skill.years_of_experience)}
                              </Badge>
                              
                              {skill.years_of_experience && skill.years_of_experience > 0 && (
                                <span className="text-xs text-gray-500 font-medium">
                                  {skill.years_of_experience}yr{skill.years_of_experience > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Call to Action if no skills */}
          {skills.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center py-12"
            >
              <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg p-8 max-w-md mx-auto">
                <Code className="text-gray-400 mx-auto mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Skills Coming Soon
                </h3>
                <p className="text-gray-500">
                  Technical skills and expertise will be showcased here.
                </p>
              </div>
            </motion.div>
          )}

          {/* Skills Summary */}
          {skills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-white/30 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Skills Overview
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {skills.length}
                      </div>
                      <div className="text-sm text-gray-600">Total Skills</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {Object.keys(skillsByCategory).length}
                      </div>
                      <div className="text-sm text-gray-600">Categories</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-pink-600 mb-1">
                        {Math.round(skills.reduce((acc, skill) => acc + (skill.years_of_experience || 0), 0) / skills.length) || 0}
                      </div>
                      <div className="text-sm text-gray-600">Avg. Years</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Skills 