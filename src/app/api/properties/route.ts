import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/properties - List all properties for the current user
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const includeRelations = searchParams.get('include')?.split(',') || []

  let query = supabase.from('properties').select('*').eq('user_id', user.id)

  // Optionally include relations
  if (includeRelations.includes('rooms')) {
    query = supabase.from('properties').select('*, rooms(*)').eq('user_id', user.id)
  }
  if (includeRelations.includes('issues')) {
    query = supabase.from('properties').select('*, issues(*)').eq('user_id', user.id)
  }
  if (includeRelations.includes('tenancies')) {
    query = supabase.from('properties').select('*, tenancies(*)').eq('user_id', user.id)
  }
  if (includeRelations.includes('all')) {
    query = supabase.from('properties').select(`
      *,
      rooms(*),
      tenancies(*),
      issues(*),
      documents(*),
      compliance_reminders(*),
      photos(*)
    `).eq('user_id', user.id)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// POST /api/properties - Create a new property
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  
  const { data, error } = await supabase
    .from('properties')
    .insert({
      ...body,
      user_id: user.id
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
