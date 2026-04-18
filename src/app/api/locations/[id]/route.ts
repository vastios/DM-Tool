import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch single location
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const location = await db.location.findUnique({
      where: { id },
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
      }
    })

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      location: {
        ...location,
        tags: location.tags.map(t => t.tag),
        linkedNPCs: location.npcs.map(n => ({
          id: n.npc.id,
          name: n.npc.name,
          role: n.role,
          npcId: n.npcId
        })),
        linkedFactions: location.factions.map(f => ({
          id: f.faction.id,
          name: f.faction.name,
          description: f.description,
          factionId: f.factionId
        })),
        parentName: location.parent?.name || null
      }
    })
  } catch (error) {
    console.error('Error fetching location:', error)
    return NextResponse.json({ error: 'Failed to fetch location' }, { status: 500 })
  }
}

// PUT - Update location
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, type, parentId, imageUrl, notes, isVisited, tagIds, linkedNPCs, linkedFactions } = body

    // Update location basic data
    const location = await db.location.update({
      where: { id },
      data: {
        name: name?.trim(),
        description: description?.trim() || null,
        type: type || null,
        parentId: parentId || null,
        imageUrl: imageUrl?.trim() || null,
        notes: notes?.trim() || null,
        isVisited: isVisited || false,
      }
    })

    // Update tags if provided
    if (tagIds !== undefined) {
      await db.taggedLocation.deleteMany({
        where: { locationId: id }
      })

      if (tagIds.length > 0) {
        await db.taggedLocation.createMany({
          data: tagIds.map((tagId: string) => ({
            locationId: id,
            tagId
          }))
        })
      }
    }

    // Update NPCs if provided
    if (linkedNPCs !== undefined) {
      await db.locationNPC.deleteMany({
        where: { locationId: id }
      })

      if (linkedNPCs.length > 0) {
        await db.locationNPC.createMany({
          data: linkedNPCs.map((link: { npcId: string; role: string }) => ({
            locationId: id,
            npcId: link.npcId,
            role: link.role || null
          }))
        })
      }
    }

    // Update Factions if provided
    if (linkedFactions !== undefined) {
      await db.factionLocation.deleteMany({
        where: { locationId: id }
      })

      if (linkedFactions.length > 0) {
        await db.factionLocation.createMany({
          data: linkedFactions.map((link: { factionId: string; description: string }) => ({
            locationId: id,
            factionId: link.factionId,
            description: link.description || null
          }))
        })
      }
    }

    // Refetch with all relations
    const updatedLocation = await db.location.findUnique({
      where: { id },
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
        ...updatedLocation,
        tags: updatedLocation?.tags.map(t => t.tag) || [],
        linkedNPCs: updatedLocation?.npcs.map(n => ({
          id: n.npc.id,
          name: n.npc.name,
          role: n.role,
          npcId: n.npcId
        })) || [],
        linkedFactions: updatedLocation?.factions.map(f => ({
          id: f.faction.id,
          name: f.faction.name,
          description: f.description,
          factionId: f.factionId
        })) || [],
        parentName: updatedLocation?.parent?.name || null
      }
    })
  } catch (error) {
    console.error('Error updating location:', error)
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 })
  }
}

// DELETE - Delete location
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // First delete all relations
    await db.taggedLocation.deleteMany({
      where: { locationId: id }
    })
    
    await db.locationNPC.deleteMany({
      where: { locationId: id }
    })
    
    await db.factionLocation.deleteMany({
      where: { locationId: id }
    })

    // Update children to have no parent
    await db.location.updateMany({
      where: { parentId: id },
      data: { parentId: null }
    })

    // Then delete the location
    await db.location.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting location:', error)
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 })
  }
}
