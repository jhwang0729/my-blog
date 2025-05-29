'use client'

import type { BlockType, NoteBlock } from '@/types/notes'
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
  Type,
} from 'lucide-react'
import React, { useCallback, useEffect, useRef } from 'react'

interface BlockRendererProps {
  block: NoteBlock
  isEditable: boolean
  isFocused: boolean
  onFocus: () => void
  onBlur: () => void
  onContentChange: (content: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onImageUpload?: (file: File) => Promise<string>
}

export function BlockRenderer({
  block,
  isEditable,
  isFocused,
  onFocus,
  onBlur,
  onContentChange,
  onKeyDown,
  onImageUpload,
}: BlockRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const lastContentRef = useRef<string>(block.content)

  // Save and restore cursor position
  const saveCursorPosition = useCallback(() => {
    if (!contentRef.current) return null

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return null

    const range = selection.getRangeAt(0)
    const preCaretRange = range.cloneRange()
    preCaretRange.selectNodeContents(contentRef.current)
    preCaretRange.setEnd(range.endContainer, range.endOffset)
    const caretOffset = preCaretRange.toString().length

    return caretOffset
  }, [])

  const restoreCursorPosition = useCallback((offset: number) => {
    if (!contentRef.current || offset < 0) return

    const createRange = (node: Node, offset: number): Range | null => {
      const range = document.createRange()
      let currentOffset = 0

      const walk = (node: Node): boolean => {
        if (node.nodeType === Node.TEXT_NODE) {
          const textLength = node.textContent?.length || 0
          if (currentOffset + textLength >= offset) {
            range.setStart(node, offset - currentOffset)
            range.setEnd(node, offset - currentOffset)
            return true
          }
          currentOffset += textLength
        } else {
          for (let i = 0; i < node.childNodes.length; i++) {
            if (walk(node.childNodes[i])) return true
          }
        }
        return false
      }

      if (walk(node)) return range

      // If offset is beyond content, place cursor at end
      range.selectNodeContents(node)
      range.collapse(false)
      return range
    }

    try {
      const range = createRange(contentRef.current, offset)
      if (range) {
        const selection = window.getSelection()
        if (selection) {
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }
    } catch (error) {
      // Fallback: place cursor at end
      const range = document.createRange()
      range.selectNodeContents(contentRef.current)
      range.collapse(false)
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }, [])

  // Focus management
  useEffect(() => {
    if (isFocused && contentRef.current && isEditable) {
      contentRef.current.focus()
    }
  }, [isFocused, isEditable])

  // Update content while preserving cursor position
  useEffect(() => {
    if (!contentRef.current || !isEditable) return

    // For newly imported blocks or first render, always set the content
    const currentContent = contentRef.current.textContent || ''

    // If this is a new block (empty content in DOM but block has content), set it
    if (!currentContent && block.content) {
      contentRef.current.textContent = block.content
      lastContentRef.current = block.content
      return
    }

    // Update content if it changed externally (not from user input)
    if (currentContent !== block.content && block.content !== lastContentRef.current) {
      const cursorPos = saveCursorPosition()
      contentRef.current.textContent = block.content
      lastContentRef.current = block.content

      // Restore cursor position after content update
      if (cursorPos !== null && isFocused) {
        setTimeout(() => restoreCursorPosition(cursorPos), 0)
      }
    }
  }, [block.content, isEditable, isFocused, saveCursorPosition, restoreCursorPosition])

  // Handle content changes with debouncing
  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const content = e.currentTarget.textContent || ''
      lastContentRef.current = content
      onContentChange(content)
    },
    [onContentChange]
  )

  // Handle paste to prevent HTML from being pasted
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault()
      const text = e.clipboardData.getData('text/plain')

      // Insert plain text at cursor position
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        range.insertNode(document.createTextNode(text))
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)

        // Trigger input event
        if (contentRef.current) {
          const content = contentRef.current.textContent || ''
          lastContentRef.current = content
          onContentChange(content)
        }
      }
    },
    [onContentChange]
  )

  // Handle image upload from React element
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onImageUpload) return

    try {
      const url = await onImageUpload(file)
      onContentChange(url)
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Failed to upload image. Please try again.')
    }
  }

  // Handle image upload from HTML input element
  const handleHTMLInputChange = (e: Event) => {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file || !onImageUpload) return

    onImageUpload(file)
      .then(url => {
        onContentChange(url)
      })
      .catch(error => {
        console.error('Failed to upload image:', error)
        alert('Failed to upload image. Please try again.')
      })
  }

  // Get placeholder text based on block type
  const getPlaceholder = (blockType: BlockType): string => {
    switch (blockType) {
      case 'heading1':
        return 'Heading 1'
      case 'heading2':
        return 'Heading 2'
      case 'heading3':
        return 'Heading 3'
      case 'bullet_list':
        return 'List item'
      case 'numbered_list':
        return 'Numbered list item'
      case 'quote':
        return 'Quote'
      case 'code':
        return 'Code'
      case 'callout':
        return 'Callout'
      default:
        return "Type '/' for commands"
    }
  }

  // Get block icon
  const getBlockIcon = (blockType: BlockType) => {
    const iconClass = 'w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'

    switch (blockType) {
      case 'heading1':
        return <Heading1 className={iconClass} />
      case 'heading2':
        return <Heading2 className={iconClass} />
      case 'heading3':
        return <Heading3 className={iconClass} />
      case 'bullet_list':
        return <List className={iconClass} />
      case 'numbered_list':
        return <ListOrdered className={iconClass} />
      case 'quote':
        return <Quote className={iconClass} />
      case 'code':
        return <Code className={iconClass} />
      case 'image':
        return <ImageIcon className={iconClass} />
      case 'link':
        return <Link className={iconClass} />
      case 'divider':
        return <Minus className={iconClass} />
      case 'callout':
        return <AlertCircle className={iconClass} />
      default:
        return <Type className={iconClass} />
    }
  }

  // Common editable props
  const editableProps = isEditable
    ? {
        contentEditable: true,
        suppressContentEditableWarning: true,
        onInput: handleInput,
        onFocus,
        onBlur,
        onKeyDown,
        onPaste: handlePaste,
        ref: contentRef,
        'data-placeholder': block.content ? undefined : getPlaceholder(block.block_type),
      }
    : {}

  // Base styling for all blocks
  const baseStyles = `
    outline-none focus:ring-0 
    ${!block.content && isEditable ? 'empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none' : ''}
  `

  // Render based on block type
  const renderBlockContent = () => {
    switch (block.block_type) {
      case 'heading1':
        return (
          <h1
            className={`text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100 ${baseStyles}`}
            {...editableProps}
          >
            {block.content}
          </h1>
        )

      case 'heading2':
        return (
          <h2
            className={`text-2xl font-semibold leading-tight text-gray-900 dark:text-gray-100 ${baseStyles}`}
            {...editableProps}
          >
            {block.content}
          </h2>
        )

      case 'heading3':
        return (
          <h3
            className={`text-xl font-medium leading-tight text-gray-900 dark:text-gray-100 ${baseStyles}`}
            {...editableProps}
          >
            {block.content}
          </h3>
        )

      case 'bullet_list':
        return (
          <div className="flex items-start space-x-2">
            <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
            <div className={`flex-1 leading-relaxed text-gray-900 dark:text-gray-100 ${baseStyles}`} {...editableProps}>
              {block.content}
            </div>
          </div>
        )

      case 'numbered_list':
        return (
          <div className="flex items-start space-x-3">
            <span className="mt-0.5 flex-shrink-0 font-medium text-gray-400">1.</span>
            <div className={`flex-1 leading-relaxed text-gray-900 dark:text-gray-100 ${baseStyles}`} {...editableProps}>
              {block.content}
            </div>
          </div>
        )

      case 'quote':
        return (
          <div className="border-l-4 border-gray-300 pl-4 dark:border-gray-600">
            <div className={`italic leading-relaxed text-gray-700 dark:text-gray-300 ${baseStyles}`} {...editableProps}>
              {block.content}
            </div>
          </div>
        )

      case 'code':
        return (
          <div className="rounded-lg bg-gray-100 p-4 font-mono dark:bg-gray-800">
            <div
              className={`whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100 ${baseStyles}`}
              {...editableProps}
            >
              {block.content}
            </div>
          </div>
        )

      case 'callout':
        return (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex items-start space-x-3">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
              <div
                className={`flex-1 leading-relaxed text-blue-900 dark:text-blue-100 ${baseStyles}`}
                {...editableProps}
              >
                {block.content}
              </div>
            </div>
          </div>
        )

      case 'divider':
        return (
          <div className="py-4">
            <hr className="border-gray-200 dark:border-gray-700" />
          </div>
        )

      case 'link':
        if (block.content) {
          const url = block.content.startsWith('http') ? block.content : `https://${block.content}`
          // Create shortened display URL
          const displayUrl = (() => {
            try {
              const urlObj = new URL(url)
              const domain = urlObj.hostname.replace('www.', '')
              const path = urlObj.pathname
              if (path.length > 20) {
                return `${domain}${path.substring(0, 17)}...`
              }
              return `${domain}${path}`
            } catch {
              return url.length > 40 ? `${url.substring(0, 37)}...` : url
            }
          })()

          return (
            <div className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Link className="h-4 w-4 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{displayUrl}</div>
                  <div className="truncate text-xs text-gray-500 dark:text-gray-400">Click to open in new tab</div>
                </div>
              </a>
            </div>
          )
        } else if (isEditable) {
          return (
            <div
              className={`min-h-[1.5rem] leading-relaxed text-gray-900 dark:text-gray-100 ${baseStyles}`}
              {...editableProps}
              data-placeholder="Paste or type a URL..."
            >
              {block.content}
            </div>
          )
        } else {
          return <div className="italic text-gray-500 dark:text-gray-400">Empty link</div>
        }

      case 'image':
        return (
          <div className="space-y-2">
            {block.content ? (
              <div className="group relative">
                <img src={block.content} alt="Block content" className="h-auto max-w-full rounded-lg shadow-sm" />
                {isEditable && (
                  <button
                    onClick={() => {
                      const input = document.createElement('input')
                      input.type = 'file'
                      input.accept = 'image/*'
                      input.onchange = handleHTMLInputChange
                      input.click()
                    }}
                    className="absolute right-2 top-2 rounded bg-black bg-opacity-50 px-2 py-1 text-xs text-white opacity-0 transition-all hover:bg-opacity-70 group-hover:opacity-100"
                  >
                    Replace
                  </button>
                )}
              </div>
            ) : (
              <div
                className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
                role="button"
                tabIndex={0}
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (isEditable) {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*'
                    input.onchange = handleHTMLInputChange
                    input.click()
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    const clickEvent = new MouseEvent('click', { bubbles: true })
                    e.currentTarget.dispatchEvent(clickEvent)
                  }
                }}
              >
                <ImageIcon className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">
                  {isEditable ? 'Click to upload an image' : 'No image'}
                </p>
                {isEditable && <p className="mt-1 text-xs text-gray-400">Supports JPG, PNG, GIF, WebP</p>}
              </div>
            )}
          </div>
        )

      default:
        return (
          <div
            className={`min-h-[1.5rem] leading-relaxed text-gray-900 dark:text-gray-100 ${baseStyles}`}
            {...editableProps}
            {...(block.properties?.hasInlineLink && !isEditable
              ? {
                  dangerouslySetInnerHTML: { __html: block.content },
                }
              : {})}
          >
            {(!block.properties?.hasInlineLink || isEditable) && block.content}
          </div>
        )
    }
  }

  return (
    <motion.div
      className={`group relative py-1 ${isFocused ? 'rounded ring-1 ring-blue-200 dark:ring-blue-800' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Block Type Indicator */}
      {isEditable && (
        <div className="absolute left-0 top-0 -ml-6 opacity-0 transition-opacity group-hover:opacity-100">
          {getBlockIcon(block.block_type)}
        </div>
      )}

      {renderBlockContent()}
    </motion.div>
  )
}
