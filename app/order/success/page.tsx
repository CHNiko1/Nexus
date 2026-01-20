import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { db } from '@/lib/db'
import { retrieveCheckoutSession } from '@/lib/stripe'
import { formatPrice } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const sessionId = searchParams.session_id

  if (!sessionId) {
    notFound()
  }

  // Verify the Stripe session
  const stripeSession = await retrieveCheckoutSession(sessionId)

  if (!stripeSession || stripeSession.payment_status !== 'paid') {
    notFound()
  }

  // Get the order
  const order = await db.order.findFirst({
    where: {
      stripeSessionId: sessionId,
      userId: session.user.id,
    },
    include: {
      items: true,
    },
  })

  if (!order) {
    notFound()
  }

  // Update order status if still pending
  if (order.status === 'PENDING') {
    await db.order.update({
      where: { id: order.id },
      data: { status: 'PAID' },
    })

    // Clear user's cart
    await db.cartItem.deleteMany({
      where: { userId: session.user.id },
    })
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container py-16 max-w-2xl">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl">Payment Successful!</CardTitle>
            <p className="text-muted-foreground mt-2">
              Thank you for your order. We've received your payment.
            </p>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6 space-y-6">
            <div className="text-left space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Order Details</h3>
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Number:</span>
                    <span className="font-mono font-semibold">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="capitalize">
                      {stripeSession.payment_method_types?.[0] === 'paypal' ? 'PayPal' : 'Card'}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span>{order.shipping > 0 ? formatPrice(order.shipping) : 'FREE'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax:</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <div className="bg-muted rounded-lg p-4 text-sm space-y-1">
                  <p className="font-medium">{order.shippingName}</p>
                  <p>{order.shippingAddress}</p>
                  <p>
                    {order.shippingCity}, {order.shippingState} {order.shippingZip}
                  </p>
                  <p>{order.shippingCountry}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                A confirmation email has been sent to <strong>{order.shippingEmail}</strong>
              </p>

              <div className="flex gap-3">
                <Button asChild className="flex-1">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/admin/orders">View Orders</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
