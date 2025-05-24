import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { CreateNoteData } from '@/types/notes'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/notes - Get all published notes (public) or all notes (admin)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const parentId = searchParams.get('parent_id')
    const includeArchived = searchParams.get('include_archived') === 'true'
    
    const offset = (page - 1) * limit

    // Check if user is authenticated (admin)
    const { data: { user } } = await supabase.auth.getUser()
    const isAdmin = !!user

    let query = supabase
      .from('notes')
      .select(`
        *,
        child_notes:notes!parent_note_id(id, title, slug, icon, is_published, created_at),
        parent_note:notes!parent_note_id(id, title, slug, icon)
      `)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    // Create count query with same filters
    let countQuery = supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })

    // Filter based on authentication
    if (!isAdmin) {
      query = query.eq('is_published', true)
      countQuery = countQuery.eq('is_published', true)
      if (!includeArchived) {
        query = query.eq('is_archived', false)
        countQuery = countQuery.eq('is_archived', false)
      }
    } else if (!includeArchived) {
      query = query.eq('is_archived', false)
      countQuery = countQuery.eq('is_archived', false)
    }

    // Apply filters
    if (parentId) {
      if (parentId === 'root') {
        query = query.is('parent_note_id', null)
        countQuery = countQuery.is('parent_note_id', null)
      } else {
        query = query.eq('parent_note_id', parentId)
        countQuery = countQuery.eq('parent_note_id', parentId)
      }
    }

    if (search) {
      const searchFilter = `title.ilike.%${search}%,content.ilike.%${search}%`
      query = query.or(searchFilter)
      countQuery = countQuery.or(searchFilter)
    }

    // Get total count
    const { count } = await countQuery

    // Get paginated results
    const { data: notes, error } = await query
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching notes:', error)
      return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
    }

    return NextResponse.json({
      notes: notes || [],
      total: count || 0,
      page,
      hasMore: (count || 0) > offset + limit
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/notes - Create a new note (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: CreateNoteData = await request.json()
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Create note data
    const noteData = {
      user_id: user.id,
      title: body.title,
      content: body.content || '',
      parent_note_id: body.parent_note_id || null,
      icon: body.icon || '📝',
      cover_image: body.cover_image || null,
      content_type: body.content_type || 'page',
      is_published: body.is_published || false,
      last_edited_by: user.id,
      last_edited_at: new Date().toISOString()
    }

    const { data: note, error } = await supabase
      .from('notes')
      .insert(noteData)
      .select(`
        *,
        parent_note:notes!parent_note_id(id, title, slug, icon)
      `)
      .single()

    if (error) {
      console.error('Error creating note:', error)
      return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
    }

    return NextResponse.json({ note }, { status: 201 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 