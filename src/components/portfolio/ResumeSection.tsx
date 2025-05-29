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
      day: 'numeric',
    })
  }

  const getFileTypeIcon = () => {
    return <FileText className="text-red-500" size={24} />
  }

  return (
    <section id="resume" className="bg-gradient-to-br from-gray-50 to-blue-50/30 py-20">
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
              <Download className="mr-3 text-blue-600" size={32} />
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Resume & CV</h2>
            </div>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">Download my latest resume in different formats</p>
          </motion.div>

          {/* Resume Files Grid */}
          {resumeFiles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
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
                  <Card className="border border-white/50 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl group-hover:bg-white/90">
                    <CardContent className="p-8">
                      {/* File Icon and Type */}
                      <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getFileTypeIcon()}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                              {resumeFile.file_name}
                            </h3>
                            <p className="text-sm text-gray-500">{resumeFile.file_type?.toUpperCase() || 'PDF'}</p>
                          </div>
                        </div>

                        <Badge variant="secondary" className="border-green-200 bg-green-100 text-green-700">
                          Latest
                        </Badge>
                      </div>

                      {/* File Details */}
                      <div className="mb-6 space-y-3">
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
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl group-hover:scale-105"
                        size="lg"
                      >
                        <Download className="mr-2" size={18} />
                        Download Resume
                      </Button>

                      {/* Preview Button (Optional) */}
                      <Button
                        variant="outline"
                        onClick={() => window.open(resumeFile.file_url, '_blank')}
                        className="mt-3 w-full border-gray-300 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-400"
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
              className="py-12 text-center"
            >
              <Card className="mx-auto max-w-md border border-white/30 bg-white/60 shadow-lg backdrop-blur-sm">
                <CardContent className="p-8">
                  <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                  <h3 className="mb-2 text-lg font-semibold text-gray-700">Resume Coming Soon</h3>
                  <p className="mb-4 text-gray-500">My resume will be available for download shortly.</p>
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
            <Card className="border border-white/30 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 shadow-lg">
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">
                  💡 <strong>Tip:</strong> My resume is regularly updated with new experience and skills. Check back
                  frequently for the latest version!
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
            <p className="mb-4 text-gray-600">Need a custom format or have questions about my experience?</p>
            <Button
              variant="outline"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-blue-300 text-blue-600 transition-all duration-300 hover:bg-blue-50"
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
