'use client'

import type { SlashCommand } from '@/types/notes'
import { motion } from 'framer-motion'
import {
    AlertCircle,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Image as ImageIcon,
    Link,
    List,
    ListOrdered,
    Minus,
    Quote,
    Search,
    Type
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface SlashCommandMenuProps {
  position: { x: number; y: number }
  onSelectCommand: (command: SlashCommand) => void
  onClose: () => void
}

// Available slash commands
const SLASH_COMMANDS: SlashCommand[] = [
  {
    id: 'paragraph',
    label: 'Text',
    description: 'Just start writing with plain text.',
    icon: 'Type',
    blockType: 'paragraph',
    keywords: ['text', 'paragraph', 'plain']
  },
  {
    id: 'heading1',
    label: 'Heading 1',
    description: 'Big section heading.',
    icon: 'Heading1',
    blockType: 'heading1',
    keywords: ['h1', 'heading', 'title', 'big']
  },
  {
    id: 'heading2',
    label: 'Heading 2',
    description: 'Medium section heading.',
    icon: 'Heading2',
    blockType: 'heading2',
    keywords: ['h2', 'heading', 'subtitle']
  },
  {
    id: 'heading3',
    label: 'Heading 3',
    description: 'Small section heading.',
    icon: 'Heading3',
    blockType: 'heading3',
    keywords: ['h3', 'heading', 'small']
  },
  {
    id: 'bullet_list',
    label: 'Bulleted list',
    description: 'Create a simple bulleted list.',
    icon: 'List',
    blockType: 'bullet_list',
    keywords: ['bullet', 'list', 'ul', 'unordered']
  },
  {
    id: 'numbered_list',
    label: 'Numbered list',
    description: 'Create a list with numbering.',
    icon: 'ListOrdered',
    blockType: 'numbered_list',
    keywords: ['numbered', 'list', 'ol', 'ordered', '1']
  },
  {
    id: 'quote',
    label: 'Quote',
    description: 'Capture a quote.',
    icon: 'Quote',
    blockType: 'quote',
    keywords: ['quote', 'citation', 'blockquote']
  },
  {
    id: 'code',
    label: 'Code',
    description: 'Capture a code snippet.',
    icon: 'Code',
    blockType: 'code',
    keywords: ['code', 'snippet', 'programming', 'monospace']
  },
  {
    id: 'callout',
    label: 'Callout',
    description: 'Make writing stand out.',
    icon: 'AlertCircle',
    blockType: 'callout',
    keywords: ['callout', 'note', 'info', 'highlight']
  },
  {
    id: 'link',
    label: 'Link',
    description: 'Create a link to another page.',
    icon: 'Link',
    blockType: 'link',
    keywords: ['link', 'url', 'external', 'page', 'website']
  },
  {
    id: 'divider',
    label: 'Divider',
    description: 'Visually divide blocks.',
    icon: 'Minus',
    blockType: 'divider',
    keywords: ['divider', 'separator', 'line', 'hr']
  },
  {
    id: 'image',
    label: 'Image',
    description: 'Upload or embed with a link.',
    icon: 'ImageIcon',
    blockType: 'image',
    keywords: ['image', 'picture', 'photo', 'upload']
  }
]

// Icon mapping
const ICON_MAP = {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  ImageIcon,
  Minus,
  AlertCircle,
  Link
}

export function SlashCommandMenu({ 
  position, 
  onSelectCommand, 
  onClose 
}: SlashCommandMenuProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter commands based on search
  const filteredCommands = SLASH_COMMANDS.filter(command => {
    const query = searchQuery.toLowerCase()
    return (
      command.label.toLowerCase().includes(query) ||
      command.description.toLowerCase().includes(query) ||
      command.keywords.some(keyword => keyword.includes(query))
    )
  })

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            onSelectCommand(filteredCommands[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, filteredCommands, onSelectCommand, onClose])

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15 }}
      className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[320px] max-w-[400px]"
      style={{
        left: position.x,
        top: position.y,
        maxHeight: '400px'
      }}
    >
      {/* Search Input */}
      <div className="p-3 border-b border-gray-100 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for a block type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Commands List */}
      <div className="max-h-80 overflow-y-auto">
        {filteredCommands.length > 0 ? (
          <div className="p-1">
            {filteredCommands.map((command, index) => {
              const IconComponent = ICON_MAP[command.icon as keyof typeof ICON_MAP]
              
              return (
                <button
                  key={command.id}
                  onClick={() => onSelectCommand(command)}
                  className={`w-full p-3 text-left rounded-md transition-colors ${
                    index === selectedIndex
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-1.5 rounded ${
                      index === selectedIndex
                        ? 'bg-blue-100 dark:bg-blue-800'
                        : 'bg-gray-100 dark:bg-gray-600'
                    }`}>
                      <IconComponent className={`w-4 h-4 ${
                        index === selectedIndex
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm ${
                        index === selectedIndex
                          ? 'text-blue-900 dark:text-blue-100'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {command.label}
                      </div>
                      <div className={`text-xs mt-0.5 ${
                        index === selectedIndex
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {command.description}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="text-gray-400 dark:text-gray-500 text-sm">
              No blocks found for "{searchQuery}"
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded text-xs">↑↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded text-xs">↵</kbd>
              <span>Select</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded text-xs">Esc</kbd>
            <span>Close</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 