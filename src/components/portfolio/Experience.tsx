'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { WorkExperience } from '@/types/database'
import { motion } from 'framer-motion'
import { Briefcase, Calendar, ExternalLink, MapPin } from 'lucide-react'

interface ExperienceProps {
  experiences: WorkExperience[]
}

const Experience = ({ experiences }: ExperienceProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
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
    <section id="experience" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-4">
              <Briefcase className="text-blue-600 mr-3" size={32} />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Work Experience
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              My professional journey and the amazing companies I've had the privilege to work with
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-purple-300 to-pink-200"></div>

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
                <div className="absolute left-6 md:left-1/2 md:transform md:-translate-x-1/2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-white shadow-lg z-10"></div>

                {/* Content Card */}
                <div className={`ml-16 md:ml-0 ${index % 2 === 0 ? 'md:mr-1/2 md:pr-12' : 'md:ml-1/2 md:pl-12'}`}>
                  <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-8">
                      {/* Company and Role */}
                      <div className="mb-4">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                          {experience.job_title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="text-lg font-semibold text-blue-600">
                            {experience.company_name}
                          </span>
                          {experience.company_url && (
                            <a
                              href={experience.company_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Meta Information */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
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
                            className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200"
                          >
                            {experience.employment_type}
                          </Badge>
                        </div>
                      )}

                      {/* Description */}
                      {experience.description && (
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {experience.description}
                        </p>
                      )}

                      {/* Technologies */}
                      {experience.technologies && experience.technologies.length > 0 && (
                        <div className="pt-4 border-t border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3">Technologies Used:</h4>
                          <div className="flex flex-wrap gap-2">
                            {experience.technologies.map((tech, idx) => (
                              <Badge 
                                key={idx}
                                variant="outline"
                                className="text-xs bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                              >
                                {tech}
                              </Badge>
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
              className="text-center py-12"
            >
              <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg p-8 max-w-md mx-auto">
                <Briefcase className="text-gray-400 mx-auto mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Experience Coming Soon
                </h3>
                <p className="text-gray-500">
                  Professional experience details will be updated here.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Experience 