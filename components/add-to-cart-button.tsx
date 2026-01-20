"use client"

import { useRouter } from 'next/navigation'
import { useTransition, useState, useEffect } from 'react'
import { ShoppingCart, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import Link from 'next/link'

type Props = {
  productId: string
  slug?: string
  disabled?: boolean
}

export function AddToCartButton({ productId, slug, disabled }: Props) {
  const [isPending, startTransition] = useTransition()
  const [inCart, setInCart] = useState(false)
  const router = useRouter()

  // Check if product is already in cart
  useEffect(() => {
    const checkCart = async () => {
      try {
        const res = await fetch('/api/cart')
        if (res.ok) {
          const data = await res.json()
          const isInCart = data.items?.some((item: any) => item.productId === productId)
          setInCart(isInCart)
        }
      } catch (error) {
        // User not logged in or error occurred
      }
    }
    checkCart()
  }, [productId])

  const handleAdd = () => {
    startTransition(async () => {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      })

      if (res.status === 401) {
        const callback = slug ? `/products/${slug}` : '/products'
        router.push(`/login?callbackUrl=${encodeURIComponent(callback)}`)
        return
      }

      if (!res.ok) {
        toast({ title: 'Could not add to cart', variant: 'destructive' })
        return
      }

      toast({ title: 'Added to cart', description: 'Keep shopping or checkout from your cart.' })
      setInCart(true)
      router.refresh()
    })
  }

  if (inCart) {
    return (
      <div className="flex gap-2 w-full">
        <Button size="lg" className="flex-1" variant="outline" asChild>
          <Link href="/cart">
            <Check className="mr-2 h-5 w-5" />
            In Cart
          </Link>
        </Button>
        <Button size="lg" className="px-6" onClick={handleAdd} disabled={disabled || isPending}>
          <Plus className="mr-1 h-5 w-5" />
          1
        </Button>
      </div>
    )
  }

  return (
    <Button size="lg" className="w-full" disabled={disabled || isPending} onClick={handleAdd}>
      <ShoppingCart className="mr-2 h-5 w-5" />
      {isPending ? 'Adding...' : 'Add to Cart'}
    </Button>
  )
}
