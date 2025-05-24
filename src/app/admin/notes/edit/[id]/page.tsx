'use client'

import { BlockEditor } from '@/components/notes/block-editor'
import type { Note, NoteBlock } from '@/types/notes'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    Eye,
    Globe,
    Lock,
    MoreHorizontal,
    Save,
    Trash2
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function EditNotePage() {
  const params = useParams()
  const router = useRouter()
  const noteId = params.id as string

  const [note, setNote] = useState<Note | null>(null)
  const [blocks, setBlocks] = useState<NoteBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [icon, setIcon] = useState('📝')
  
  const titleInputRef = useRef<HTMLInputElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout>()

  // Fetch note data
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`/api/notes/${noteId}`)
        const data = await response.json()
        
        if (response.ok) {
          setNote(data.note)
          setTitle(data.note.title)
          setIcon(data.note.icon || '📝')
          setBlocks(data.note.blocks || [])
        } else {
          console.error('Failed to fetch note:', data.error)
          router.push('/admin/notes')
        }
      } catch (error) {
        console.error('Error fetching note:', error)
        router.push('/admin/notes')
      } finally {
        setLoading(false)
      }
    }

    if (noteId) {
      fetchNote()
    }
  }, [noteId, router])

  // Auto-save functionality
  const autoSave = async () => {
    if (!note || saving) return

    setSaving(true)
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          icon,
          blocks
        })
      })

      if (!response.ok) {
        const data = await response.json()
        console.error('Failed to save note:', data.error)
      }
    } catch (error) {
      console.error('Error saving note:', error)
    } finally {
      setSaving(false)
    }
  }

  // Debounced auto-save
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (note && (title !== note.title || icon !== note.icon)) {
        autoSave()
      }
    }, 1000)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [title, icon])

  // Debounced auto-save for blocks
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (note && blocks.length >= 0) { // Save even if blocks array is empty
        autoSave()
      }
    }, 1000)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [blocks])

  // Handle block editor events
  useEffect(() => {
    const handleBlockCreated = (e: CustomEvent) => {
      const { block, index } = e.detail
      setBlocks(prev => {
        const newBlocks = [...prev]
        newBlocks.splice(index, 0, block)
        return newBlocks
      })
    }

    const handleBlockUpdated = (e: CustomEvent) => {
      const { blockId, updates } = e.detail
      setBlocks(prev => prev.map(block => 
        block.id === blockId ? { ...block, ...updates } : block
      ))
    }

    const handleBlockDeleted = (e: CustomEvent) => {
      const { blockId } = e.detail
      setBlocks(prev => prev.filter(block => block.id !== blockId))
    }

    const handleBlockMoved = (e: CustomEvent) => {
      const { blockId, newIndex } = e.detail
      setBlocks(prev => {
        const blockIndex = prev.findIndex(b => b.id === blockId)
        if (blockIndex === -1) return prev
        
        const newBlocks = [...prev]
        const [movedBlock] = newBlocks.splice(blockIndex, 1)
        newBlocks.splice(newIndex, 0, movedBlock)
        return newBlocks
      })
    }

    window.addEventListener('block-created', handleBlockCreated as EventListener)
    window.addEventListener('block-updated', handleBlockUpdated as EventListener)
    window.addEventListener('block-deleted', handleBlockDeleted as EventListener)
    window.addEventListener('block-moved', handleBlockMoved as EventListener)

    return () => {
      window.removeEventListener('block-created', handleBlockCreated as EventListener)
      window.removeEventListener('block-updated', handleBlockUpdated as EventListener)
      window.removeEventListener('block-deleted', handleBlockDeleted as EventListener)
      window.removeEventListener('block-moved', handleBlockMoved as EventListener)
    }
  }, [])

  // Toggle publish status
  const togglePublished = async () => {
    if (!note) return

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_published: !note.is_published
        })
      })

      if (response.ok) {
        setNote(prev => prev ? { ...prev, is_published: !prev.is_published } : null)
      }
    } catch (error) {
      console.error('Error toggling publish status:', error)
    }
  }

  // Delete note
  const deleteNote = async () => {
    if (!note || !confirm('Are you sure you want to delete this note?')) return

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.push('/admin/notes')
      }
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Note not found
          </h2>
          <Link
            href="/admin/notes"
            className="text-blue-600 hover:text-blue-700"
          >
            Back to notes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/notes"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>
              
              <div className="flex items-center space-x-2">
                {saving ? (
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                    <Save className="w-4 h-4" />
                    <span>Saved</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Publish Toggle */}
              <motion.button
                onClick={togglePublished}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  note.is_published
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {note.is_published ? (
                  <>
                    <Globe className="w-4 h-4" />
                    <span>Published</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Draft</span>
                  </>
                )}
              </motion.button>

              {/* Preview Button */}
              {note.is_published && (
                <Link
                  href={`/notes/${note.slug}`}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </Link>
              )}

              {/* More Options */}
              <div className="relative">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Editor Content */}
      <main className="pb-32">
        {/* Title Section */}
        <div className="max-w-4xl mx-auto px-6 pt-8">
          <div className="flex items-center space-x-4 mb-8">
            {/* Icon Picker */}
            <button
              className="text-4xl hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
              title="Change icon"
            >
              {icon}
            </button>

            {/* Title Input */}
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              className="flex-1 text-4xl font-bold text-gray-900 dark:text-white bg-transparent border-none outline-none placeholder-gray-400"
            />
          </div>
        </div>

        {/* Block Editor */}
        <BlockEditor
          noteId={noteId}
          blocks={blocks}
          onBlocksChange={setBlocks}
          isEditable={true}
        />
      </main>

      {/* Footer Actions */}
      <div className="fixed bottom-6 right-6">
        <motion.button
          onClick={deleteNote}
          className="p-3 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition-colors shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Delete note"
        >
          <Trash2 className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  )
} 