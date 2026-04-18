import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch all locations with tags, NPCs, and factions
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

    // Fetch locations with all relations
    const locations = await db.location.findMany({
      where: { campaignId: campaign.id },
      include: {
        tags: {
          include: {
            tag: true
          }
        },
        npcs: {
          include: {
            npc: true
          }
        },
        factions: {
          include: {
            faction: true
          }
        },
        parent: true,
        children: true
      },
      orderBy: { name: 'asc' }
    })

    // Fetch all tags for this campaign
    const tags = await db.tag.findMany({
      where: { campaignId: campaign.id }
    })

    // Fetch all NPCs for this campaign (for linking)
    const npcs = await db.nPC.findMany({
      where: { campaignId: campaign.id },
      select: { id: true, name: true, race: true, class: true }
    })

    // Fetch all factions for this campaign (for linking)
    const factions = await db.faction.findMany({
      where: { campaignId: campaign.id },
      select: { id: true, name: true, type: true }
    })

    // Transform locations to include tags, npcs, factions directly
    const transformedLocations = locations.map(loc => ({
      ...loc,
      tags: loc.tags.map(t => t.tag),
      linkedNPCs: loc.npcs.map(n => ({
        id: n.npc.id,
        name: n.npc.name,
        role: n.role
      })),
      linkedFactions: loc.factions.map(f => ({
        id: f.faction.id,
        name: f.faction.name,
        description: f.description
      })),
      parentName: loc.parent?.name || null
    }))

    return NextResponse.json({ 
      locations: transformedLocations,
      tags,
      npcs,
      factions
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
    const { name, description, type, parentId, imageUrl, notes, isVisited, tagIds, linkedNPCs, linkedFactions } = body

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
        parentId: parentId || null,
        imageUrl: imageUrl?.trim() || null,
        notes: notes?.trim() || null,
        isVisited: isVisited || false,
        campaignId: campaign.id,
        tags: tagIds?.length > 0 ? {
          create: tagIds.map((tagId: string) => ({
            tagId
          }))
        } : undefined,
        npcs: linkedNPCs?.length > 0 ? {
          create: linkedNPCs.map((link: { npcId: string; role: string }) => ({
            npcId: link.npcId,
            role: link.role || null
          }))
        } : undefined,
        factions: linkedFactions?.length > 0 ? {
          create: linkedFactions.map((link: { factionId: string; description: string }) => ({
            factionId: link.factionId,
            description: link.description || null
          }))
        } : undefined
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        },
        npcs: {
          include: {
            npc: true
          }
        },
        factions: {
          include: {
            faction: true
          }
        },
        parent: true
      }
    })

    return NextResponse.json({ 
      location: {
        ...location,
        tags: location.tags.map(t => t.tag),
        linkedNPCs: location.npcs.map(n => ({
          id: n.npc.id,
          name: n.npc.name,
          role: n.role
        })),
        linkedFactions: location.factions.map(f => ({
          id: f.faction.id,
          name: f.faction.name,
          description: f.description
        })),
        parentName: location.parent?.name || null
      }
    })
  } catch (error) {
    console.error('Error creating location:', error)
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 })
  }
}
