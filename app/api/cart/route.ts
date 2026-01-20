import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET: fetch current user's cart
export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const items = await db.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          images: { orderBy: { position: 'asc' } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ items })
}

// POST: add item to cart (upsert)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { productId, quantity = 1 }: { productId?: string; quantity?: number } = await req.json()

    if (!productId || quantity <= 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const product = await db.product.findUnique({ where: { id: productId, published: true } })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (product.stock <= 0) {
      return NextResponse.json({ error: 'Product out of stock' }, { status: 400 })
    }

    // Find existing cart item
    const existingItem = await db.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId,
        variantId: null,
      },
    })

    let cartItem

    if (existingItem) {
      // Update existing item
      cartItem = await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: { include: { images: true } },
        },
      })
    } else {
      // Create new item
      cartItem = await db.cartItem.create({
        data: {
          userId: session.user.id,
          productId,
          variantId: null,
          quantity,
        },
        include: {
          product: { include: { images: true } },
        },
      })
    }

    return NextResponse.json({ item: cartItem })
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}
