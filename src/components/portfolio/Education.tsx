'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Education } from '@/types/database'
import { motion } from 'framer-motion'
import { Calendar, GraduationCap, MapPin, Star } from 'lucide-react'

interface EducationProps {
  education: Education[]
}

const Education = ({ education }: EducationProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    })
  }

  const formatDateRange = (startDate: string | null, endDate: string | null) => {
    if (!startDate) return 'Date TBD'
    const start = formatDate(startDate)
    const end = endDate ? formatDate(endDate) : 'Present'
    return `${start} - ${end}`
  }

  const formatGPA = (gpa: number | null) => {
    if (!gpa) return null
    return gpa.toFixed(2)
  }

  const getGPAColor = (gpa: number | null) => {
    if (!gpa) return 'gray'
    if (gpa >= 3.8) return 'green'
    if (gpa >= 3.5) return 'blue'
    if (gpa >= 3.0) return 'yellow'
    return 'red'
  }

  return (
    <section id="education" className="bg-gradient-to-br from-purple-50 to-blue-50/30 py-20">
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
              <GraduationCap className="mr-3 text-purple-600" size={32} />
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Education</h2>
            </div>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">My academic journey and educational achievements</p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute bottom-0 left-8 top-0 w-px bg-gradient-to-b from-purple-200 via-blue-300 to-indigo-200 md:left-1/2 md:-translate-x-1/2 md:transform"></div>

            {education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative mb-12 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
              >
                {/* Timeline Node */}
                <div className="absolute left-6 z-10 h-4 w-4 rounded-full border-4 border-white bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg md:left-1/2 md:-translate-x-1/2 md:transform"></div>

                {/* Content Card */}
                <div className={`ml-16 md:ml-0 ${index % 2 === 0 ? 'md:mr-1/2 md:pr-12' : 'md:ml-1/2 md:pl-12'}`}>
                  <Card className="border border-white/50 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <CardContent className="p-8">
                      {/* Institution and Degree */}
                      <div className="mb-4">
                        <h3 className="mb-2 text-xl font-bold text-gray-900 md:text-2xl">{edu.institution_name}</h3>
                        <div className="mb-3">
                          <span className="text-lg font-semibold text-purple-600">{edu.degree}</span>
                          {edu.field_of_study && <span className="ml-2 text-gray-700">in {edu.field_of_study}</span>}
                        </div>
                      </div>

                      {/* Meta Information */}
                      <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2" />
                          <span>{formatDateRange(edu.start_date, edu.end_date)}</span>
                        </div>
                        {edu.location && (
                          <div className="flex items-center">
                            <MapPin size={16} className="mr-2" />
                            <span>{edu.location}</span>
                          </div>
                        )}
                      </div>

                      {/* GPA Badge */}
                      {edu.gpa && (
                        <div className="mb-4">
                          <Badge
                            variant="secondary"
                            className={`bg-gradient-to-r ${
                              getGPAColor(edu.gpa) === 'green'
                                ? 'border-green-200 from-green-100 to-emerald-100 text-green-800'
                                : getGPAColor(edu.gpa) === 'blue'
                                  ? 'border-blue-200 from-blue-100 to-cyan-100 text-blue-800'
                                  : getGPAColor(edu.gpa) === 'yellow'
                                    ? 'border-yellow-200 from-yellow-100 to-orange-100 text-yellow-800'
                                    : 'border-red-200 from-red-100 to-pink-100 text-red-800'
                            }`}
                          >
                            <Star size={14} className="mr-1" />
                            GPA: {formatGPA(edu.gpa)}
                          </Badge>
                        </div>
                      )}

                      {/* Description */}
                      {edu.description && (
                        <div className="border-t border-gray-200 pt-4">
                          <p className="leading-relaxed text-gray-600">{edu.description}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          {education.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="py-12 text-center"
            >
              <div className="mx-auto max-w-md rounded-lg border border-white/30 bg-white/60 p-8 backdrop-blur-sm">
                <GraduationCap className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="mb-2 text-lg font-semibold text-gray-700">Education Coming Soon</h3>
                <p className="text-gray-500">Educational background details will be updated here.</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Education
