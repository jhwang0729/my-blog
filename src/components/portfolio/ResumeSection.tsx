'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { ResumeFile } from '@/types/database'
import { motion } from 'framer-motion'
import { Calendar, Download, Eye, FileText } from 'lucide-react'

interface ResumeSectionProps {
  resumeFiles: ResumeFile[]
}

const ResumeSection = ({ resumeFiles }: ResumeSectionProps) => {
  const handleDownload = async (resumeFile: ResumeFile) => {
    try {
      // Track download
      await fetch('/api/resume/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId: resumeFile.id }),
      })

      // Trigger download
      const link = document.createElement('a')
      link.href = resumeFile.file_url
      link.download = resumeFile.original_filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getFileTypeIcon = (fileType: string | null) => {
    return <FileText className="text-red-500" size={24} />
  }

  return (
    <section id="resume" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
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
              <Download className="text-blue-600 mr-3" size={32} />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Resume & CV
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Download my latest resume in different formats
            </p>
          </motion.div>

          {/* Resume Files Grid */}
          {resumeFiles.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {resumeFiles.map((resumeFile, index) => (
                <motion.div
                  key={resumeFile.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:bg-white/90">
                    <CardContent className="p-8">
                      {/* File Icon and Type */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          {getFileTypeIcon(resumeFile.file_type)}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {resumeFile.file_name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {resumeFile.file_type?.toUpperCase() || 'PDF'}
                            </p>
                          </div>
                        </div>
                        
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                          Latest
                        </Badge>
                      </div>

                      {/* File Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2" />
                            <span>Updated: {formatDate(resumeFile.updated_at)}</span>
                          </div>
                          <span>{formatFileSize(resumeFile.file_size)}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <Eye size={16} className="mr-2" />
                          <span>{resumeFile.download_count} downloads</span>
                        </div>
                      </div>

                      {/* Download Button */}
                      <Button
                        onClick={() => handleDownload(resumeFile)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                        size="lg"
                      >
                        <Download className="mr-2" size={18} />
                        Download Resume
                      </Button>

                      {/* Preview Button (Optional) */}
                      <Button
                        variant="outline"
                        onClick={() => window.open(resumeFile.file_url, '_blank')}
                        className="w-full mt-3 border-gray-300 hover:border-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-300"
                      >
                        <Eye className="mr-2" size={18} />
                        Preview Online
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            /* No Resume Files */
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center py-12"
            >
              <Card className="bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg max-w-md mx-auto">
                <CardContent className="p-8">
                  <FileText className="text-gray-400 mx-auto mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Resume Coming Soon
                  </h3>
                  <p className="text-gray-500 mb-4">
                    My resume will be available for download shortly.
                  </p>
                  <Button variant="outline" disabled className="w-full">
                    <Download className="mr-2" size={18} />
                    Download Resume
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-white/30 shadow-lg">
              <CardContent className="p-6">
                <p className="text-gray-600 text-sm">
                  💡 <strong>Tip:</strong> My resume is regularly updated with new experience and skills. 
                  Check back frequently for the latest version!
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600 mb-4">
              Need a custom format or have questions about my experience?
            </p>
            <Button
              variant="outline"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-blue-300 text-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              Get In Touch
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ResumeSection 