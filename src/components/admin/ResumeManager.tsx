'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase'
import { formatFileSize } from '@/lib/utils'
import type { ResumeFile } from '@/types/database'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import {
  Download,
  FileText,
  Plus,
  Trash2,
  Upload
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ResumeManagerProps {
  user: SupabaseUser
  initialFiles: ResumeFile[]
}

export default function ResumeManager({ user, initialFiles }: ResumeManagerProps) {
  const [files, setFiles] = useState<ResumeFile[]>(initialFiles)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a PDF or Word document (.pdf, .docx, .doc)')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setSelectedFile(file)
    setFileName(file.name.replace(/\.[^/.]+$/, '')) // Remove extension for display name
    setError('')
  }

  const handleUpload = async () => {
    if (!selectedFile || !fileName.trim()) {
      setError('Please select a file and provide a name')
      return
    }

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop()
      const fileName_unique = `${user.id}/${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName_unique, selectedFile)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName_unique)

      // Save file record to database
      const { data: fileRecord, error: dbError } = await supabase
        .from('resume_files')
        .insert({
          user_id: user.id,
          file_name: fileName.trim(),
          original_filename: selectedFile.name,
          file_url: publicUrl,
          file_size: selectedFile.size,
          file_type: fileExt,
          is_public: true
        })
        .select()
        .single()

      if (dbError) {
        throw dbError
      }

      // Update local state
      setFiles(prev => [fileRecord, ...prev])
      setSuccess('Resume uploaded successfully!')
      setSelectedFile(null)
      setFileName('')
      
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''

    } catch (err: any) {
      setError(`Upload failed: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (fileId: string, filePath: string) => {
    if (!confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      return
    }

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('resumes')
        .remove([filePath])

      if (storageError) {
        console.warn('Storage deletion error:', storageError)
        // Continue with database deletion even if storage fails
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('resume_files')
        .delete()
        .eq('id', fileId)

      if (dbError) {
        throw dbError
      }

      // Update local state
      setFiles(prev => prev.filter(file => file.id !== fileId))
      setSuccess('Resume deleted successfully!')

    } catch (err: any) {
      setError(`Delete failed: ${err.message}`)
    }
  }

  const handleDownload = async (file: ResumeFile) => {
    try {
      // Increment download count
      await supabase
        .from('resume_files')
        .update({ download_count: file.download_count + 1 })
        .eq('id', file.id)

      // Download file
      window.open(file.file_url, '_blank')

      // Update local state
      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { ...f, download_count: f.download_count + 1 }
          : f
      ))

    } catch (err: any) {
      setError(`Download failed: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Resume Manager</h1>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/admin')}
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload New Resume
            </CardTitle>
            <CardDescription>
              Upload PDF or Word documents (max 10MB). These will be publicly downloadable.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert>
                <AlertDescription className="text-green-600">{success}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="file-input" className="text-sm font-medium text-gray-700 mb-2 block">
                  Select File
                </label>
                <Input
                  id="file-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
                {selectedFile && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="file-name" className="text-sm font-medium text-gray-700 mb-2 block">
                  Display Name
                </label>
                <Input
                  id="file-name"
                  type="text"
                  placeholder="e.g., Software Engineer Resume"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  disabled={uploading}
                />
              </div>
            </div>

            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || !fileName.trim() || uploading}
              className="w-full md:w-auto"
            >
              {uploading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Uploading...
                </div>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Resume
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Files List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Resume Files</CardTitle>
            <CardDescription>
              Manage your uploaded resume files. All files are publicly downloadable.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No resume files uploaded yet.</p>
                <p className="text-sm">Upload your first resume file above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {files.map((file) => (
                  <div 
                    key={file.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                      <div>
                        <h3 className="font-medium">{file.file_name}</h3>
                        <p className="text-sm text-gray-500">
                          {file.original_filename} • {formatFileSize(file.file_size || 0)}
                        </p>
                        <p className="text-xs text-gray-400">
                          Uploaded {new Date(file.created_at).toLocaleDateString()} • 
                          Downloaded {file.download_count} times
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(file)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(file.id, file.file_url.split('/').pop() || '')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 