import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { itemId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { quantity }: { quantity?: number } = await req.json()
  if (quantity === undefined || quantity < 0) {
    return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 })
  }

  try {
    if (quantity === 0) {
      await db.cartItem.delete({
        where: { id: params.itemId, userId: session.user.id },
      })
      return NextResponse.json({ ok: true })
    }

    const updated = await db.cartItem.update({
      where: { id: params.itemId, userId: session.user.id },
      data: { quantity },
      include: { product: { include: { images: true } } },
    })

    return NextResponse.json({ item: updated })
  } catch (error) {
    console.error('Update cart item error:', error)
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { itemId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await db.cartItem.delete({ where: { id: params.itemId, userId: session.user.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Delete cart item error:', error)
    return NextResponse.json({ error: 'Failed to delete cart item' }, { status: 500 })
  }
}
