'use client'

import { BlockEditor } from '@/components/notes/block-editor'
import type { Note, NoteBlock } from '@/types/notes'
import { motion } from 'framer-motion'
import { ArrowLeft, Eye, Globe, Lock, MoreHorizontal, Save, Trash2 } from 'lucide-react'
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
          blocks,
        }),
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

  // Debounced auto-save for title/icon
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
  }, [title, icon, autoSave, note])

  // Debounced auto-save for blocks
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (note && blocks.length >= 0) {
        // Save even if blocks array is empty
        autoSave()
      }
    }, 1000)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [blocks, autoSave, note])

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
      setBlocks(prev => prev.map(block => (block.id === blockId ? { ...block, ...updates } : block)))
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
          is_published: !note.is_published,
        }),
      })

      if (response.ok) {
        setNote(prev => (prev ? { ...prev, is_published: !prev.is_published } : null))
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
        method: 'DELETE',
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
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Note not found</h2>
          <Link href="/admin/notes" className="text-blue-600 hover:text-blue-700">
            Back to notes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/notes"
                className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Link>

              <div className="flex items-center space-x-2">
                {saving ? (
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                    <Save className="h-4 w-4" />
                    <span>Saved</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Publish Toggle */}
              <motion.button
                onClick={togglePublished}
                className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  note.is_published
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {note.is_published ? (
                  <>
                    <Globe className="h-4 w-4" />
                    <span>Published</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Draft</span>
                  </>
                )}
              </motion.button>

              {/* Preview Button */}
              {note.is_published && (
                <Link
                  href={`/notes/${note.slug}`}
                  className="flex items-center space-x-2 rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </Link>
              )}

              {/* More Options */}
              <div className="relative">
                <button className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                  <MoreHorizontal className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Editor Content */}
      <main className="pb-32">
        {/* Title Section */}
        <div className="mx-auto max-w-4xl px-6 pt-8">
          <div className="mb-8 flex items-center space-x-4">
            {/* Icon Picker */}
            <button
              className="rounded-lg p-2 text-4xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Change icon"
            >
              {icon}
            </button>

            {/* Title Input */}
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Untitled"
              className="flex-1 border-none bg-transparent text-4xl font-bold text-gray-900 placeholder-gray-400 outline-none dark:text-white"
            />
          </div>
        </div>

        {/* Block Editor */}
        <BlockEditor noteId={noteId} blocks={blocks} onBlocksChange={setBlocks} isEditable={true} />
      </main>

      {/* Footer Actions */}
      <div className="fixed bottom-6 right-6">
        <motion.button
          onClick={deleteNote}
          className="rounded-full bg-red-100 p-3 text-red-600 shadow-lg transition-colors hover:bg-red-200 dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-800"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Delete note"
        >
          <Trash2 className="h-5 w-5" />
        </motion.button>
      </div>
    </div>
  )
}
