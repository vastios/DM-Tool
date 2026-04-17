import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch all locations with tags
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

    // Fetch locations with tags
    const locations = await db.location.findMany({
      where: { campaignId: campaign.id },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Fetch all tags for this campaign
    const tags = await db.tag.findMany({
      where: { campaignId: campaign.id }
    })

    // Transform locations to include tags directly
    const transformedLocations = locations.map(loc => ({
      ...loc,
      tags: loc.tags.map(t => t.tag)
    }))

    return NextResponse.json({ 
      locations: transformedLocations,
      tags 
    })
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 })
  }
}

// POST - Create new location
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, type, parentName, notes, isVisited, tagIds } = body

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

    // Create location
    const location = await db.location.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        type: type || null,
        parentName: parentName?.trim() || null,
        notes: notes?.trim() || null,
        isVisited: isVisited || false,
        campaignId: campaign.id,
        tags: tagIds?.length > 0 ? {
          create: tagIds.map((tagId: string) => ({
            tagId
          }))
        } : undefined
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    return NextResponse.json({ 
      location: {
        ...location,
        tags: location.tags.map(t => t.tag)
      }
    })
  } catch (error) {
    console.error('Error creating location:', error)
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 })
  }
}
