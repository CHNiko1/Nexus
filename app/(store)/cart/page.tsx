import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import CartClient from './cart-client'

export default async function CartPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login?callbackUrl=/cart')
  }

  const items = await db.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          images: { orderBy: { position: 'asc' } },
          category: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return <CartClient items={items} userEmail={session.user.email ?? ''} />
}
