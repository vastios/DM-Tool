import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch all tags
export async function GET() {
  try {
    // Get or create default campaign
    let campaign = await db.campaign.findFirst()
    
    if (!campaign) {
      campaign = await db.campaign.create({
        data: {
          name: 'Nuova Campagna',
          description: 'Campagna predefinita',
        }
      })
    }

    const tags = await db.tag.findMany({
      where: { campaignId: campaign.id },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ tags })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}

// POST - Create new tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, color, description } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Get or create default campaign
    let campaign = await db.campaign.findFirst()
    
    if (!campaign) {
      campaign = await db.campaign.create({
        data: {
          name: 'Nuova Campagna',
          description: 'Campagna predefinita',
        }
      })
    }

    // Check if tag already exists
    const existingTag = await db.tag.findFirst({
      where: {
        campaignId: campaign.id,
        name: name.trim()
      }
    })

    if (existingTag) {
      return NextResponse.json({ tag: existingTag })
    }

    // Create tag
    const tag = await db.tag.create({
      data: {
        name: name.trim(),
        color: color || '#6b7280',
        description: description?.trim() || null,
        campaignId: campaign.id
      }
    })

    return NextResponse.json({ tag })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 })
  }
}
