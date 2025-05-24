import type { BlockType, NoteBlock } from '@/types/notes'
import { useCallback } from 'react'

interface UseNoteEditorReturn {
  createBlock: (noteId: string, blockType: BlockType, content: string, index?: number) => NoteBlock
  updateBlock: (blockId: string, updates: Partial<NoteBlock>) => void
  deleteBlock: (blockId: string) => void
  moveBlock: (blockId: string, newIndex: number) => void
  duplicateBlock: (blockId: string) => void
}

export function useNoteEditor(): UseNoteEditorReturn {
  
  // Generate a simple UUID for blocks (in production, use a proper UUID library)
  const generateId = () => {
    return 'block_' + Math.random().toString(36).substr(2, 9)
  }

  const createBlock = useCallback((
    noteId: string, 
    blockType: BlockType, 
    content: string = '', 
    index?: number
  ): NoteBlock => {
    const newBlock: NoteBlock = {
      id: generateId(),
      note_id: noteId,
      block_type: blockType,
      content,
      properties: {},
      sort_order: index ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // TODO: In a real implementation, this would update the parent component's state
    // or sync with a server/database. For now, we'll emit custom events
    // that the parent BlockEditor can listen to.
    
    window.dispatchEvent(new CustomEvent('block-created', { 
      detail: { block: newBlock, index }
    }))

    return newBlock
  }, [])

  const updateBlock = useCallback((blockId: string, updates: Partial<NoteBlock>) => {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    }

    window.dispatchEvent(new CustomEvent('block-updated', {
      detail: { blockId, updates: updateData }
    }))
  }, [])

  const deleteBlock = useCallback((blockId: string) => {
    window.dispatchEvent(new CustomEvent('block-deleted', {
      detail: { blockId }
    }))
  }, [])

  const moveBlock = useCallback((blockId: string, newIndex: number) => {
    window.dispatchEvent(new CustomEvent('block-moved', {
      detail: { blockId, newIndex }
    }))
  }, [])

  const duplicateBlock = useCallback((blockId: string) => {
    window.dispatchEvent(new CustomEvent('block-duplicated', {
      detail: { blockId }
    }))
  }, [])

  return {
    createBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    duplicateBlock
  }
} 