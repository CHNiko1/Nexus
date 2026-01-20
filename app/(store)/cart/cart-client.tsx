"use client"

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag, Trash2, ArrowLeft, Plus, Minus } from 'lucide-react'
import type { CartItem, Product, ProductImage, Category } from '@prisma/client'

type CartItemWithProduct = CartItem & { product: Product & { images: ProductImage[]; category: Category | null } }

type Props = {
  items: CartItemWithProduct[]
  userEmail: string
}

type ShippingForm = {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

export default function CartClient({ items: initialItems, userEmail }: Props) {
  const [items, setItems] = useState<CartItemWithProduct[]>(initialItems)
  const [shipping, setShipping] = useState<ShippingForm>({
    name: '',
    email: userEmail,
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  })
  const [isCheckout, startCheckout] = useTransition()
  const [isUpdating, startUpdate] = useTransition()
  const router = useRouter()

  const subtotal = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)
  const shippingCost = subtotal >= 50 || subtotal === 0 ? 0 : 9.99
  const tax = Math.round(subtotal * 0.08 * 100) / 100
  const total = subtotal + shippingCost + tax

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 0) return
    startUpdate(async () => {
      const res = await fetch(`/api/cart/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      })

      if (!res.ok) {
        toast({ title: 'Failed to update cart', variant: 'destructive' })
        return
      }

      if (quantity === 0) {
        setItems(prev => prev.filter(item => item.id !== id))
        return
      }

      const data = await res.json()
      setItems(prev => prev.map(item => (item.id === id ? { ...item, quantity: data.item.quantity } : item)))
    })
  }

  const removeItem = (id: string) => updateQuantity(id, 0)

  const handleCheckout = () => {
    if (!items.length) {
      toast({ title: 'Your cart is empty', description: 'Add items before checkout.' })
      return
    }

    const requiredFields: Array<keyof ShippingForm> = ['name', 'email', 'address', 'city', 'state', 'zip', 'country']
    for (const field of requiredFields) {
      if (!shipping[field]) {
        toast({ title: 'Missing info', description: 'Please fill all shipping fields.', variant: 'destructive' })
        return
      }
    }

    startCheckout(async () => {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            variant: item.variantId ?? undefined,
          })),
          shippingInfo: shipping,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast({ title: 'Checkout failed', description: data.error || 'Try again.', variant: 'destructive' })
        return
      }

      const data = await res.json()
      if (data.url) {
        router.push(data.url)
      } else {
        toast({ title: 'Order created', description: 'Redirecting to payment...' })
      }
    })
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="container py-8">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/products">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <p className="text-muted-foreground">{items.length} items</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-10">
        {items.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-6">Your cart is empty</p>
              <Button size="lg" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6 space-y-6">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4 pb-6 border-b last:border-0 last:pb-0">
                      <div className="relative h-24 w-24 overflow-hidden rounded-lg border bg-muted flex-shrink-0">
                        {item.product.images[0] ? (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.product.slug}`}>
                          <h3 className="font-semibold hover:text-blue-600 transition line-clamp-2 mb-1">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-3">
                          {item.product.category?.name}
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          {formatPrice(Number(item.product.price))}
                        </p>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          disabled={isUpdating}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center border rounded-lg bg-muted">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={isUpdating}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={isUpdating}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <Input
                      placeholder="Full name"
                      value={shipping.name}
                      onChange={e => setShipping({ ...shipping, name: e.target.value })}
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={shipping.email}
                      onChange={e => setShipping({ ...shipping, email: e.target.value })}
                    />
                    <Input
                      placeholder="Phone"
                      value={shipping.phone}
                      onChange={e => setShipping({ ...shipping, phone: e.target.value })}
                    />
                    <Input
                      placeholder="Address"
                      value={shipping.address}
                      onChange={e => setShipping({ ...shipping, address: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="City"
                        value={shipping.city}
                        onChange={e => setShipping({ ...shipping, city: e.target.value })}
                      />
                      <Input
                        placeholder="State"
                        value={shipping.state}
                        onChange={e => setShipping({ ...shipping, state: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="ZIP / Postal"
                        value={shipping.zip}
                        onChange={e => setShipping({ ...shipping, zip: e.target.value })}
                      />
                      <Input
                        placeholder="Country"
                        value={shipping.country}
                        onChange={e => setShipping({ ...shipping, country: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                        {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                      </span>
                    </div>
                    {subtotal > 0 && shippingCost === 0 && (
                      <p className="text-xs text-green-600 bg-green-50 p-2 rounded">
                        ✓ Free shipping on orders over $50!
                      </p>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">{formatPrice(tax)}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold text-blue-600">{formatPrice(total)}</span>
                  </div>
                  
                  {/* Payment Methods */}
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2 text-center">We accept:</p>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <div className="text-xs bg-muted px-2 py-1 rounded font-medium">Visa</div>
                      <div className="text-xs bg-muted px-2 py-1 rounded font-medium">Mastercard</div>
                      <div className="text-xs bg-muted px-2 py-1 rounded font-medium">Amex</div>
                      <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded font-medium">PayPal</div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Secure checkout powered by Stripe
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full h-12 text-lg" onClick={handleCheckout} disabled={isCheckout}>
                    {isCheckout ? 'Processing...' : 'Proceed to Checkout'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
