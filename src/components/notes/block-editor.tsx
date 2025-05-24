'use client'

import { useNoteEditor } from '@/hooks/use-note-editor'
import type { BlockType, NoteBlock, SlashCommand } from '@/types/notes'
import { AnimatePresence, motion } from 'framer-motion'
import { GripVertical, Plus, Trash2, Upload } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BlockRenderer } from './block-renderer'
import { SlashCommandMenu } from './slash-command-menu'

interface BlockEditorProps {
  noteId: string
  blocks: NoteBlock[]
  onBlocksChange: (blocks: NoteBlock[]) => void
  isEditable?: boolean
}

// History entry for undo/redo
interface HistoryEntry {
  blocks: NoteBlock[]
  timestamp: number
}

export function BlockEditor({ 
  noteId, 
  blocks, 
  onBlocksChange, 
  isEditable = true 
}: BlockEditorProps) {
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null)
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 })
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)
  const [selectedBlocks, setSelectedBlocks] = useState<Set<string>>(new Set())
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState<string | null>(null)
  
  // Undo/Redo history
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { createBlock, updateBlock, deleteBlock, moveBlock } = useNoteEditor()

  // Add to history with debouncing
  const addToHistory = useCallback((newBlocks: NoteBlock[]) => {
    // Clear any pending history addition
    if (historyTimeoutRef.current) {
      clearTimeout(historyTimeoutRef.current)
    }

    // Debounce history additions to avoid too many entries
    historyTimeoutRef.current = setTimeout(() => {
      setHistory(prev => {
        // If we're not at the end of history, remove everything after current index
        const newHistory = prev.slice(0, historyIndex + 1)
        
        // Add new entry
        newHistory.push({
          blocks: JSON.parse(JSON.stringify(newBlocks)), // Deep clone
          timestamp: Date.now()
        })
        
        // Limit history size
        if (newHistory.length > 50) {
          newHistory.shift()
        }
        
        return newHistory
      })
      
      setHistoryIndex(prev => Math.min(prev + 1, 49))
    }, 500) // 500ms debounce
  }, [historyIndex])

  // Initialize history
  useEffect(() => {
    if (history.length === 0 && blocks.length > 0) {
      setHistory([{
        blocks: JSON.parse(JSON.stringify(blocks)),
        timestamp: Date.now()
      }])
      setHistoryIndex(0)
    }
  }, [blocks, history.length])

  // Undo function
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const historyEntry = history[newIndex]
      if (historyEntry) {
        setHistoryIndex(newIndex)
        onBlocksChange(JSON.parse(JSON.stringify(historyEntry.blocks)))
      }
    }
  }, [historyIndex, history, onBlocksChange])

  // Redo function
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const historyEntry = history[newIndex]
      if (historyEntry) {
        setHistoryIndex(newIndex)
        onBlocksChange(JSON.parse(JSON.stringify(historyEntry.blocks)))
      }
    }
  }, [historyIndex, history, onBlocksChange])

  // Listen to block events from the hook
  useEffect(() => {
    const handleBlockCreated = (e: CustomEvent) => {
      const { block, index } = e.detail
      const newBlocks = [...blocks]
      if (typeof index === 'number') {
        newBlocks.splice(index, 0, block)
      } else {
        newBlocks.push(block)
      }
      onBlocksChange(newBlocks)
      addToHistory(newBlocks)
    }

    const handleBlockUpdated = (e: CustomEvent) => {
      const { blockId, updates } = e.detail
      const newBlocks = blocks.map(block => 
        block.id === blockId ? { ...block, ...updates } : block
      )
      onBlocksChange(newBlocks)
      addToHistory(newBlocks)
    }

    const handleBlockDeleted = (e: CustomEvent) => {
      const { blockId } = e.detail
      const newBlocks = blocks.filter(block => block.id !== blockId)
      onBlocksChange(newBlocks)
      addToHistory(newBlocks)
    }

    const handleBlockMoved = (e: CustomEvent) => {
      const { blockId, newIndex } = e.detail
      const newBlocks = [...blocks]
      const blockIndex = newBlocks.findIndex(b => b.id === blockId)
      if (blockIndex !== -1) {
        const [movedBlock] = newBlocks.splice(blockIndex, 1)
        newBlocks.splice(newIndex, 0, movedBlock)
        onBlocksChange(newBlocks)
        addToHistory(newBlocks)
      }
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
  }, [blocks, onBlocksChange, addToHistory])

  // Handle keyboard shortcuts for selection and undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo (Cmd/Ctrl + Z)
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey && isEditable) {
        e.preventDefault()
        undo()
        return
      }

      // Redo (Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y)
      if (((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) || 
          ((e.metaKey || e.ctrlKey) && e.key === 'y')) {
        if (isEditable) {
          e.preventDefault()
          redo()
          return
        }
      }

      // Select all blocks (Cmd/Ctrl + A)
      if ((e.metaKey || e.ctrlKey) && e.key === 'a' && isEditable) {
        e.preventDefault()
        const allBlockIds = new Set(blocks.map(b => b.id))
        setSelectedBlocks(allBlockIds)
      }

      // Delete selected blocks (Delete or Backspace)
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedBlocks.size > 0 && isEditable) {
        // Check if we're currently editing a block
        const activeElement = document.activeElement
        const isEditingBlock = activeElement?.hasAttribute('contenteditable') && 
                              activeElement.getAttribute('contenteditable') === 'true'
        
        // Only delete if we have selected blocks and we're not actively editing text
        if (!isEditingBlock || selectedBlocks.size > 1) {
          e.preventDefault()
          deleteSelectedBlocks()
        }
      }

      // Clear selection (Escape)
      if (e.key === 'Escape') {
        setSelectedBlocks(new Set())
        setShowSlashMenu(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedBlocks, blocks, isEditable, undo, redo])

  // Delete selected blocks
  const deleteSelectedBlocks = useCallback(() => {
    if (selectedBlocks.size === 0) return

    // Confirm if deleting multiple blocks
    if (selectedBlocks.size > 1) {
      if (!confirm(`Delete ${selectedBlocks.size} blocks?`)) return
    }

    // Delete each selected block
    selectedBlocks.forEach(blockId => {
      deleteBlock(blockId)
    })

    // Clear selection
    setSelectedBlocks(new Set())
  }, [selectedBlocks, deleteBlock])

  // Handle block selection with click
  const handleBlockClick = useCallback((blockId: string, e: React.MouseEvent) => {
    if (!isEditable) return

    if (e.shiftKey && selectionStart) {
      // Range selection with shift
      const startIndex = blocks.findIndex(b => b.id === selectionStart)
      const endIndex = blocks.findIndex(b => b.id === blockId)
      
      if (startIndex !== -1 && endIndex !== -1) {
        const start = Math.min(startIndex, endIndex)
        const end = Math.max(startIndex, endIndex)
        const newSelection = new Set<string>()
        
        for (let i = start; i <= end; i++) {
          newSelection.add(blocks[i].id)
        }
        
        setSelectedBlocks(newSelection)
      }
    } else if (e.metaKey || e.ctrlKey) {
      // Toggle selection with cmd/ctrl
      const newSelection = new Set(selectedBlocks)
      if (newSelection.has(blockId)) {
        newSelection.delete(blockId)
      } else {
        newSelection.add(blockId)
      }
      setSelectedBlocks(newSelection)
      setSelectionStart(blockId)
    } else {
      // Single selection
      setSelectedBlocks(new Set([blockId]))
      setSelectionStart(blockId)
    }
  }, [blocks, selectedBlocks, selectionStart, isEditable])

  // Parse markdown content into blocks
  const parseMarkdownToBlocks = useCallback((markdown: string): NoteBlock[] => {
    console.log('🔵 START MARKDOWN PARSING')
    console.log('📝 Full markdown content:', markdown)
    console.log('📏 Content length:', markdown.length)
    console.log('📊 Content preview (first 500 chars):', markdown.substring(0, 500))
    
    const lines = markdown.split('\n')
    console.log('📋 Split into lines:', lines.length, 'lines')
    lines.forEach((line, i) => {
      if (i < 10) { // Log first 10 lines
        console.log(`  Line ${i}: "${line}" (length: ${line.length})`)
      }
    })
    
    const parsedBlocks: NoteBlock[] = []
    let listCounter = 1
    let inCodeBlock = false
    let codeContent = ''
    let codeLanguage = ''

    lines.forEach((line, index) => {
      console.log(`\n🔍 Processing line ${index}:`)
      console.log(`  Raw line: "${line}"`)
      console.log(`  Line length: ${line.length}`)
      console.log(`  Trimmed: "${line.trim()}"`)
      console.log(`  Trimmed length: ${line.trim().length}`)
      
      // Handle code blocks specially
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          // Starting a code block
          inCodeBlock = true
          codeLanguage = line.trim().substring(3)
          codeContent = ''
          console.log('  ✅ Starting code block with language:', codeLanguage)
          return
        } else {
          // Ending a code block
          inCodeBlock = false
          console.log('  ✅ Ending code block')
          console.log('  Code content:', codeContent)
          
          const block: NoteBlock = {
            id: `imported_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
            note_id: noteId,
            block_type: 'code',
            content: codeContent.trim(),
            properties: codeLanguage ? { language: codeLanguage } : {},
            sort_order: parsedBlocks.length,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          
          console.log('  📦 Created code block:', JSON.stringify(block, null, 2))
          parsedBlocks.push(block)
          return
        }
      }

      // If we're inside a code block, accumulate content
      if (inCodeBlock) {
        codeContent += (codeContent ? '\n' : '') + line
        console.log('  📝 Accumulating code content, total length:', codeContent.length)
        return
      }

      // Don't trim the line initially to preserve indentation for nested lists
      const originalLine = line
      const trimmedLine = line.trim()
      
      // Handle empty lines - create empty paragraph blocks to preserve spacing
      if (!trimmedLine) {
        console.log('  ✅ Empty line - creating empty paragraph')
        const block: NoteBlock = {
          id: `imported_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
          note_id: noteId,
          block_type: 'paragraph',
          content: '',
          properties: {},
          sort_order: parsedBlocks.length,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        console.log('  📦 Created empty block:', JSON.stringify(block, null, 2))
        parsedBlocks.push(block)
        return
      }

      let blockType: BlockType = 'paragraph'
      let content = originalLine // Use original line to preserve full content
      
      console.log('  🎯 Checking markdown patterns...')
      
      // Parse different markdown elements
      if (trimmedLine.startsWith('### ')) {
        blockType = 'heading3'
        content = originalLine.replace(/^[\s]*### /, '').trim()
        console.log('  ✅ Found H3, extracted content:', content)
      } else if (trimmedLine.startsWith('## ')) {
        blockType = 'heading2'
        content = originalLine.replace(/^[\s]*## /, '').trim()
        console.log('  ✅ Found H2, extracted content:', content)
      } else if (trimmedLine.startsWith('# ')) {
        blockType = 'heading1'
        content = originalLine.replace(/^[\s]*# /, '').trim()
        console.log('  ✅ Found H1, extracted content:', content)
      } else if (trimmedLine.startsWith('> ')) {
        blockType = 'quote'
        content = originalLine.replace(/^[\s]*> /, '').trim()
        console.log('  ✅ Found quote, extracted content:', content)
      } else if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
        blockType = 'bullet_list'
        // Handle both * and - for bullet lists, preserving indentation
        content = originalLine.replace(/^[\s]*[\*\-] /, '').trim()
        listCounter = 1 // Reset numbered list counter
        console.log('  ✅ Found bullet, extracted content:', content)
      } else if (/^\s*\d+\.\s/.test(originalLine)) {
        blockType = 'numbered_list'
        content = originalLine.replace(/^\s*\d+\.\s/, '').trim()
        listCounter++
        console.log('  ✅ Found numbered list, extracted content:', content)
      } else if (trimmedLine === '---' || trimmedLine === '***' || trimmedLine === '___') {
        blockType = 'divider'
        content = ''
        console.log('  ✅ Found divider')
      } else if (trimmedLine.startsWith('![') && trimmedLine.includes('](')) {
        // Handle markdown images ![alt](url)
        const match = trimmedLine.match(/!\[([^\]]*)\]\(([^)]+)\)/)
        if (match) {
          blockType = 'image'
          content = match[2] // URL
          console.log('  ✅ Found image with URL:', content)
        }
      } else if (trimmedLine.startsWith('[') && trimmedLine.includes('](')) {
        // Handle markdown links [text](url)
        const match = trimmedLine.match(/\[([^\]]*)\]\(([^)]+)\)/)
        if (match) {
          blockType = 'link'
          content = match[2] // URL
          console.log('  ✅ Found link with URL:', content)
        }
      } else {
        // Regular paragraph - use the original line content
        content = originalLine.trim()
        console.log('  ✅ Creating paragraph with content:', content)
      }

      console.log('  📊 Block type:', blockType)
      console.log('  📊 Content to save:', content)
      console.log('  📊 Content length:', content.length)

      // Ensure we have some content or it's a valid empty block type
      if (content || blockType === 'divider' || blockType === 'paragraph') {
        const block: NoteBlock = {
          id: `imported_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
          note_id: noteId,
          block_type: blockType,
          content: content, // This should now contain the full content
          properties: {},
          sort_order: parsedBlocks.length,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        console.log('  📦 FINAL BLOCK CREATED:')
        console.log('    - ID:', block.id)
        console.log('    - Type:', block.block_type)
        console.log('    - Content:', block.content)
        console.log('    - Content length:', block.content?.length)
        console.log('    - Full block:', JSON.stringify(block, null, 2))
        
        parsedBlocks.push(block)
        console.log('  ✅ Block added to array. Total blocks:', parsedBlocks.length)
      } else {
        console.log('  ❌ Skipping block - no content and not a valid empty type')
      }
    })

    console.log('\n🎯 PARSING COMPLETE')
    console.log('📊 Total blocks created:', parsedBlocks.length)
    console.log('📋 All blocks summary:')
    parsedBlocks.forEach((block, i) => {
      console.log(`  Block ${i}:`)
      console.log(`    - Type: ${block.block_type}`)
      console.log(`    - Content: "${block.content}"`)
      console.log(`    - Content length: ${block.content?.length}`)
      console.log(`    - Has content: ${!!block.content}`)
    })
    
    console.log('\n🔵 RETURNING BLOCKS:', JSON.stringify(parsedBlocks, null, 2))
    return parsedBlocks
  }, [noteId])

  // Handle markdown file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🟢 FILE UPLOAD STARTED')
    const file = event.target.files?.[0]
    if (!file) {
      console.log('❌ No file selected')
      return
    }

    console.log('📁 File selected:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString()
    })

    if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown')) {
      console.log('❌ Invalid file type')
      alert('Please select a markdown file (.md or .markdown)')
      return
    }

    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      console.log('📖 FILE READ COMPLETE')
      const content = e.target?.result as string
      console.log('📝 File content type:', typeof content)
      console.log('📏 File content loaded:', content?.length, 'characters')
      console.log('📄 First 500 characters:', content?.substring(0, 500))
      console.log('📄 Last 500 characters:', content?.substring(content.length - 500))
      
      if (content) {
        console.log('🔧 Calling parseMarkdownToBlocks...')
        const importedBlocks = parseMarkdownToBlocks(content)
        console.log('✅ Parsing complete. Imported blocks:', importedBlocks.length)
        
        console.log('📊 Imported blocks details:')
        importedBlocks.forEach((block, i) => {
          console.log(`  Block ${i}:`)
          console.log(`    - ID: ${block.id}`)
          console.log(`    - Type: ${block.block_type}`)
          console.log(`    - Content: "${block.content}"`)
          console.log(`    - Content length: ${block.content?.length}`)
          console.log(`    - Has content: ${!!block.content}`)
          console.log(`    - Full block:`, JSON.stringify(block, null, 2))
        })
        
        console.log('📚 Current blocks before merge:', blocks.length)
        const newBlocks = [...blocks, ...importedBlocks]
        console.log('📚 Total blocks after merge:', newBlocks.length)
        
        console.log('🔄 Calling onBlocksChange...')
        onBlocksChange(newBlocks)
        console.log('✅ onBlocksChange called')
        
        // Add to history to enable undo and trigger auto-save
        console.log('📜 Adding to history...')
        addToHistory(newBlocks)
        console.log('✅ Added to history')
      } else {
        console.error('❌ No content found in file')
      }
    }
    
    reader.onerror = (error) => {
      console.error('❌ Failed to read file:', error)
      alert('Failed to read the selected file')
    }
    
    console.log('📖 Starting file read...')
    reader.readAsText(file)
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      console.log('✅ File input reset')
    }
  }, [blocks, onBlocksChange, parseMarkdownToBlocks, addToHistory])

  // Handle image upload (simple base64 for now, in production use cloud storage)
  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve(reader.result as string)
      }
      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }
      reader.readAsDataURL(file)
    })
  }, [])

  // Handle slash command detection
  const handleTextChange = useCallback((blockId: string, content: string) => {
    // Check for slash command
    if (content.endsWith('/')) {
      const blockElement = document.querySelector(`[data-block-id="${blockId}"]`)
      if (blockElement) {
        const rect = blockElement.getBoundingClientRect()
        setSlashMenuPosition({ x: rect.left, y: rect.bottom + 5 })
        setShowSlashMenu(true)
      }
    } else {
      setShowSlashMenu(false)
    }

    // Check for URL pattern and handle inline links
    const urlPattern = /^https?:\/\/.+/i
    if (urlPattern.test(content.trim())) {
      const currentBlock = blocks.find(b => b.id === blockId)
      if (currentBlock && currentBlock.block_type !== 'link') {
        
        // Check if this looks like an inline link scenario
        // (URL pasted at the end of existing text)
        const words = content.trim().split(/\s+/)
        const lastWord = words[words.length - 1]
        
        if (words.length > 1 && urlPattern.test(lastWord)) {
          // This looks like a URL pasted after text - create inline link
          const textPart = words.slice(0, -1).join(' ')
          const urlPart = lastWord
          
          // Create a styled inline link within the paragraph
          const linkHTML = `${textPart} <a href="${urlPart.startsWith('http') ? urlPart : `https://${urlPart}`}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline">${urlPart}</a>`
          
          updateBlock(blockId, { 
            content: linkHTML,
            properties: { ...currentBlock.properties, hasInlineLink: true }
          })
          
          return // Don't do regular update if we converted
        } else {
          // Full URL as separate link block
          updateBlock(blockId, { 
            block_type: 'link', 
            content: content.trim() 
          })
          
          // Set cursor to end after conversion
          setTimeout(() => {
            const blockElement = document.querySelector(`[data-block-id="${blockId}"] [contenteditable]`) as HTMLElement
            if (blockElement) {
              blockElement.focus()
              const range = document.createRange()
              const selection = window.getSelection()
              if (selection) {
                range.selectNodeContents(blockElement)
                range.collapse(false)
                selection.removeAllRanges()
                selection.addRange(range)
              }
            }
          }, 50)
          
          return // Don't do regular update if we converted
        }
      }
    }

    // Handle live markdown conversion
    const markdownPatterns = [
      { pattern: /^### (.+)$/, blockType: 'heading3' as BlockType },
      { pattern: /^## (.+)$/, blockType: 'heading2' as BlockType },
      { pattern: /^# (.+)$/, blockType: 'heading1' as BlockType },
      { pattern: /^> (.+)$/, blockType: 'quote' as BlockType },
      { pattern: /^[\*\-] (.+)$/, blockType: 'bullet_list' as BlockType },
      { pattern: /^1\. (.+)$/, blockType: 'numbered_list' as BlockType },
      { pattern: /^```(.*)$/, blockType: 'code' as BlockType },
    ]

    for (const { pattern, blockType } of markdownPatterns) {
      const match = content.match(pattern)
      if (match) {
        const cleanContent = match[1] || match[0]
        
        // Update block type and content, then focus with cursor at end
        updateBlock(blockId, { 
          block_type: blockType, 
          content: cleanContent.trim() 
        })
        
        // Set cursor to end after conversion
        setTimeout(() => {
          const blockElement = document.querySelector(`[data-block-id="${blockId}"] [contenteditable]`) as HTMLElement
          if (blockElement) {
            blockElement.focus()
            // Place cursor at end
            const range = document.createRange()
            const selection = window.getSelection()
            if (selection) {
              range.selectNodeContents(blockElement)
              range.collapse(false)
              selection.removeAllRanges()
              selection.addRange(range)
            }
          }
        }, 50)
        
        return // Don't do regular update if we converted
      }
    }

    // Regular content update
    updateBlock(blockId, { content })
  }, [updateBlock, blocks])

  // Handle slash command selection
  const handleSlashCommand = useCallback((command: SlashCommand) => {
    if (!focusedBlockId) return
    
    const currentBlock = blocks.find(b => b.id === focusedBlockId)
    if (!currentBlock) return

    // Remove the slash from content
    const cleanContent = currentBlock.content.slice(0, -1)
    
    updateBlock(focusedBlockId, {
      block_type: command.blockType,
      content: cleanContent
    })
    
    setShowSlashMenu(false)
    
    // Focus the block after conversion
    setTimeout(() => {
      const blockElement = document.querySelector(`[data-block-id="${focusedBlockId}"] [contenteditable]`) as HTMLElement
      if (blockElement) {
        blockElement.focus()
        // Place cursor at end
        const range = document.createRange()
        const selection = window.getSelection()
        if (selection) {
          range.selectNodeContents(blockElement)
          range.collapse(false)
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }
    }, 50)
  }, [focusedBlockId, blocks, updateBlock])

  // Handle key events for block navigation and creation
  const handleKeyDown = useCallback((e: React.KeyboardEvent, blockId: string) => {
    const currentIndex = blocks.findIndex(b => b.id === blockId)
    const currentBlock = blocks[currentIndex]

    switch (e.key) {
      case 'Enter':
        if (!e.shiftKey) {
          e.preventDefault()
          
          let newBlockType: BlockType = 'paragraph'
          let newContent = ''
          
          // Continue list formatting
          if (currentBlock.block_type === 'bullet_list') {
            newBlockType = 'bullet_list'
          } else if (currentBlock.block_type === 'numbered_list') {
            newBlockType = 'numbered_list'
          }
          
          // Create new block after current one
          const newBlock = createBlock(noteId, newBlockType, newContent, currentIndex + 1)
          
          // Focus the new block after a brief delay
          setTimeout(() => {
            const newElement = document.querySelector(`[data-block-id="${newBlock.id}"] [contenteditable]`) as HTMLElement
            newElement?.focus()
          }, 50)
        }
        break

      case 'Backspace':
        if (currentBlock.content === '' && blocks.length > 1) {
          e.preventDefault()
          deleteBlock(blockId)
          
          // Focus previous block
          const prevBlock = blocks[currentIndex - 1]
          if (prevBlock) {
            setTimeout(() => {
              const prevElement = document.querySelector(`[data-block-id="${prevBlock.id}"] [contenteditable]`) as HTMLElement
              if (prevElement) {
                prevElement.focus()
                // Place cursor at end
                const range = document.createRange()
                const selection = window.getSelection()
                if (selection) {
                  range.selectNodeContents(prevElement)
                  range.collapse(false)
                  selection.removeAllRanges()
                  selection.addRange(range)
                }
              }
            }, 50)
          }
        }
        break

      case 'ArrowUp':
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault()
          const prevBlock = blocks[currentIndex - 1]
          if (prevBlock) {
            const prevElement = document.querySelector(`[data-block-id="${prevBlock.id}"] [contenteditable]`) as HTMLElement
            prevElement?.focus()
          }
        }
        break

      case 'ArrowDown':
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault()
          const nextBlock = blocks[currentIndex + 1]
          if (nextBlock) {
            const nextElement = document.querySelector(`[data-block-id="${nextBlock.id}"] [contenteditable]`) as HTMLElement
            nextElement?.focus()
          }
        }
        break

      case 'Escape':
        setShowSlashMenu(false)
        setSelectedBlocks(new Set())
        break
    }
  }, [blocks, noteId, createBlock, updateBlock, deleteBlock])

  // Handle drag and drop
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, blockId: string) => {
    setDraggedBlock(blockId)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, targetBlockId: string) => {
    e.preventDefault()
    
    if (!draggedBlock || draggedBlock === targetBlockId) return

    const draggedIndex = blocks.findIndex(b => b.id === draggedBlock)
    const targetIndex = blocks.findIndex(b => b.id === targetBlockId)

    if (draggedIndex === -1 || targetIndex === -1) return

    moveBlock(draggedBlock, targetIndex)
    setDraggedBlock(null)
  }, [draggedBlock, blocks, moveBlock])

  // Add new block at the end
  const addNewBlock = useCallback(() => {
    const newBlock = createBlock(noteId, 'paragraph', '', blocks.length)
    
    setTimeout(() => {
      const newElement = document.querySelector(`[data-block-id="${newBlock.id}"] [contenteditable]`) as HTMLElement
      newElement?.focus()
    }, 50)
  }, [noteId, blocks.length, createBlock])

  return (
    <div 
      ref={editorRef}
      className="relative max-w-4xl mx-auto p-6 space-y-1"
    >
      {/* Hidden file input for markdown upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Toolbar */}
      {isEditable && (
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Markdown
            </button>

            {selectedBlocks.size > 0 && (
              <button
                onClick={deleteSelectedBlocks}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 dark:text-red-300 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete {selectedBlocks.size} block{selectedBlocks.size > 1 ? 's' : ''}
              </button>
            )}
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 space-x-2">
            <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Cmd/Ctrl+Z</code> undo • 
            <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Cmd/Ctrl+Shift+Z</code> redo • 
            <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Cmd/Ctrl+A</code> select all • 
            <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">/</code> commands
          </div>
        </div>
      )}

      <AnimatePresence>
        {blocks.map((block, index) => (
          <motion.div
            key={block.id}
            data-block-id={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`group relative ${
              draggedBlock === block.id ? 'opacity-50' : ''
            } ${
              selectedBlocks.has(block.id) 
                ? 'bg-blue-50 dark:bg-blue-900/20 rounded-lg ring-2 ring-blue-500' 
                : ''
            }`}
            draggable={isEditable}
            onDragStart={(e) => handleDragStart(e, block.id)}
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, block.id)}
            onClick={(e) => handleBlockClick(block.id, e)}
          >
            {/* Block Controls */}
            {isEditable && (
              <div className="absolute left-0 top-0 -ml-12 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                <button
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-grab active:cursor-grabbing"
                  aria-label="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const newBlock = createBlock(noteId, 'paragraph', '', index)
                    setTimeout(() => {
                      const newElement = document.querySelector(`[data-block-id="${newBlock.id}"] [contenteditable]`) as HTMLElement
                      newElement?.focus()
                    }, 50)
                  }}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Add block above"
                >
                  <Plus className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            )}

            {/* Block Content */}
            <BlockRenderer
              block={block}
              isEditable={isEditable}
              isFocused={focusedBlockId === block.id}
              onFocus={() => setFocusedBlockId(block.id)}
              onBlur={() => setFocusedBlockId(null)}
              onContentChange={(content: string) => handleTextChange(block.id, content)}
              onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, block.id)}
              onImageUpload={handleImageUpload}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add New Block Button */}
      {isEditable && (
        <motion.button
          onClick={addNewBlock}
          className="w-full p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">
            <Plus className="w-5 h-5" />
            <span>Add a block</span>
          </div>
        </motion.button>
      )}

      {/* Slash Command Menu */}
      <AnimatePresence>
        {showSlashMenu && (
          <SlashCommandMenu
            position={slashMenuPosition}
            onSelectCommand={handleSlashCommand}
            onClose={() => setShowSlashMenu(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
} 