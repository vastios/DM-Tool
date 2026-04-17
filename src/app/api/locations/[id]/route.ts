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
        }
      }
    })

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      location: {
        ...location,
        tags: location.tags.map(t => t.tag)
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
    const { name, description, type, parentName, notes, isVisited, tagIds } = body

    // Update location
    const location = await db.location.update({
      where: { id },
      data: {
        name: name?.trim(),
        description: description?.trim() || null,
        type: type || null,
        parentName: parentName?.trim() || null,
        notes: notes?.trim() || null,
        isVisited: isVisited || false,
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    // Update tags if provided
    if (tagIds !== undefined) {
      // Remove existing tags
      await db.taggedLocation.deleteMany({
        where: { locationId: id }
      })

      // Add new tags
      if (tagIds.length > 0) {
        await db.taggedLocation.createMany({
          data: tagIds.map((tagId: string) => ({
            locationId: id,
            tagId
          }))
        })
      }

      // Refetch with updated tags
      const updatedLocation = await db.location.findUnique({
        where: { id },
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
          ...updatedLocation,
          tags: updatedLocation?.tags.map(t => t.tag) || []
        }
      })
    }

    return NextResponse.json({ 
      location: {
        ...location,
        tags: location.tags.map(t => t.tag)
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

    await db.location.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting location:', error)
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 })
  }
}
