'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Project, WorkExperience } from '@/types/database'
import { motion } from 'framer-motion'
import { Briefcase, Calendar, ExternalLink, FolderOpen, Github, MapPin } from 'lucide-react'

type WorkExperienceWithProjects = WorkExperience & {
  projects: Project[]
}

interface ExperienceProps {
  experiences: WorkExperienceWithProjects[]
}

const Experience = ({ experiences }: ExperienceProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    })
  }

  const formatDateRange = (startDate: string, endDate: string | null) => {
    const start = formatDate(startDate)
    const end = endDate ? formatDate(endDate) : 'Present'
    return `${start} - ${end}`
  }

  const calculateDuration = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const months = Math.floor(diffDays / 30)
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} ${remainingMonths > 0 ? `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`
    }
    return `${months} month${months > 1 ? 's' : ''}`
  }

  return (
    <section id="experience" className="bg-gradient-to-br from-gray-50 to-blue-50/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <div className="mb-4 flex items-center justify-center">
              <Briefcase className="mr-3 text-blue-600" size={32} />
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Work Experience</h2>
            </div>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              My professional journey and the amazing companies I&apos;ve had the privilege to work with
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute bottom-0 left-8 top-0 w-px bg-gradient-to-b from-blue-200 via-purple-300 to-pink-200 md:left-1/2 md:-translate-x-1/2 md:transform"></div>

            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative mb-12 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
              >
                {/* Timeline Node */}
                <div className="absolute left-6 z-10 h-4 w-4 rounded-full border-4 border-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg md:left-1/2 md:-translate-x-1/2 md:transform"></div>

                {/* Content Card */}
                <div className={`ml-16 md:ml-0 ${index % 2 === 0 ? 'md:mr-1/2 md:pr-12' : 'md:ml-1/2 md:pl-12'}`}>
                  <Card className="border border-white/50 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <CardContent className="p-8">
                      {/* Company and Role */}
                      <div className="mb-4">
                        <h3 className="mb-2 text-xl font-bold text-gray-900 md:text-2xl">{experience.job_title}</h3>
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="text-lg font-semibold text-blue-600">{experience.company_name}</span>
                          {experience.company_url && (
                            <a
                              href={experience.company_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 transition-colors hover:text-blue-600"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Meta Information */}
                      <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2" />
                          <span>{formatDateRange(experience.start_date, experience.end_date)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">⏱️</span>
                          <span>{calculateDuration(experience.start_date, experience.end_date)}</span>
                        </div>
                        {experience.location && (
                          <div className="flex items-center">
                            <MapPin size={16} className="mr-2" />
                            <span>{experience.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Employment Type */}
                      {experience.employment_type && (
                        <div className="mb-4">
                          <Badge
                            variant="secondary"
                            className="border-blue-200 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800"
                          >
                            <Briefcase size={12} className="mr-1" />
                            {experience.employment_type}
                          </Badge>
                        </div>
                      )}

                      {/* Technologies */}
                      {experience.technologies && experience.technologies.length > 0 && (
                        <div className="mb-6">
                          <h4 className="mb-3 font-semibold text-gray-900">Technologies Used:</h4>
                          <div className="flex flex-wrap gap-2">
                            {experience.technologies.map((tech, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="border-gray-200 bg-gray-50 text-xs text-gray-700 hover:bg-gray-100"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Projects */}
                      {experience.projects && experience.projects.length > 0 && (
                        <div className="border-t border-gray-200 pt-4">
                          <div className="mb-4 flex items-center">
                            <FolderOpen size={16} className="mr-2 text-blue-600" />
                            <h4 className="font-semibold text-gray-900">Key Projects ({experience.projects.length})</h4>
                          </div>
                          <div className="space-y-4">
                            {experience.projects.map((project, projectIndex) => (
                              <motion.div
                                key={project.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: projectIndex * 0.1 }}
                                viewport={{ once: true }}
                                className="rounded-lg border border-gray-100 bg-gray-50/50 p-4"
                              >
                                <div className="mb-2 flex items-start justify-between">
                                  <h5 className="font-semibold text-gray-900">{project.title}</h5>
                                  <div className="flex gap-2">
                                    {project.project_url && (
                                      <a
                                        href={project.project_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 transition-colors hover:text-blue-700"
                                        title="View Live Project"
                                      >
                                        <ExternalLink size={14} />
                                      </a>
                                    )}
                                    {project.github_url && (
                                      <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 transition-colors hover:text-gray-700"
                                        title="View Source Code"
                                      >
                                        <Github size={14} />
                                      </a>
                                    )}
                                  </div>
                                </div>

                                {project.description && (
                                  <p className="mb-3 text-sm leading-relaxed text-gray-600">{project.description}</p>
                                )}

                                {project.technologies && project.technologies.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {project.technologies.map((tech, techIndex) => (
                                      <Badge
                                        key={techIndex}
                                        variant="outline"
                                        className="border-gray-200 bg-white/50 text-xs text-gray-600"
                                      >
                                        {tech}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          {experiences.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="py-12 text-center"
            >
              <div className="mx-auto max-w-md rounded-lg border border-white/30 bg-white/60 p-8 backdrop-blur-sm">
                <Briefcase className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="mb-2 text-lg font-semibold text-gray-700">Experience Coming Soon</h3>
                <p className="text-gray-500">Professional experience details will be updated here.</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Experience
