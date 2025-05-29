import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NoteBlock } from '@/types/notes'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/notes/[id] - Get a specific note
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createServerSupabaseClient()
    const { id: noteId } = await params

    // Check if user is authenticated (admin)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const isAdmin = !!user

    let query = supabase
      .from('notes')
      .select(
        `
        *,
        blocks:note_blocks(*),
        parent_note:notes!parent_note_id(id, title, slug, icon)
      `
      )
      .eq('id', noteId)

    // If not admin, only allow published notes
    if (!isAdmin) {
      query = query.eq('is_published', true).eq('is_archived', false)
    }

    const { data: note, error } = await query.single()

    if (error) {
      console.error('Error fetching note:', error)
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    // Increment view count if not admin
    if (!isAdmin && note.is_published) {
      await supabase
        .from('notes')
        .update({ view_count: (note.view_count || 0) + 1 })
        .eq('id', noteId)
    }

    return NextResponse.json({ note })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/notes/[id] - Update a note
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createServerSupabaseClient()
    const { id: noteId } = await params

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Prepare update data
    const updateData: Record<string, string | boolean | number | Date> = {
      last_edited_by: user.id,
      updated_at: new Date().toISOString(),
    }

    // Add fields that are being updated
    if (body.title !== undefined) updateData.title = body.title
    if (body.content !== undefined) updateData.content = body.content
    if (body.icon !== undefined) updateData.icon = body.icon
    if (body.cover_image !== undefined) updateData.cover_image = body.cover_image
    if (body.is_published !== undefined) updateData.is_published = body.is_published
    if (body.is_archived !== undefined) updateData.is_archived = body.is_archived

    // Update the note
    const { data: note, error } = await supabase
      .from('notes')
      .update(updateData)
      .eq('id', noteId)
      .eq('user_id', user.id) // Ensure user owns the note
      .select(
        `
        *,
        parent_note:notes!parent_note_id(id, title, slug, icon)
      `
      )
      .single()

    if (error) {
      console.error('Error updating note:', error)
      return NextResponse.json({ error: 'Failed to update note' }, { status: 500 })
    }

    // Handle blocks update if provided
    if (body.blocks && Array.isArray(body.blocks)) {
      // Delete existing blocks
      await supabase.from('note_blocks').delete().eq('note_id', noteId)

      // Insert new blocks
      if (body.blocks.length > 0) {
        const blocksToInsert = body.blocks.map((block: NoteBlock, index: number) => ({
          note_id: noteId,
          block_type: block.block_type,
          content: block.content,
          properties: block.properties || {},
          sort_order: index,
          parent_block_id: block.parent_block_id || null,
        }))

        const { error: blocksError } = await supabase.from('note_blocks').insert(blocksToInsert)

        if (blocksError) {
          console.error('Error updating blocks:', blocksError)
          // Don't return error here as note update succeeded
        }
      }
    }

    return NextResponse.json({ note })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/notes/[id] - Delete a note
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createServerSupabaseClient()
    const { id: noteId } = await params

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete the note (cascading deletes will handle blocks, comments, etc.)
    const { error } = await supabase.from('notes').delete().eq('id', noteId).eq('user_id', user.id) // Ensure user owns the note

    if (error) {
      console.error('Error deleting note:', error)
      return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
