import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { sendOrderConfirmation } from '@/lib/email'
import { formatPrice } from '@/lib/utils'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = headers().get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Update order status
        const order = await db.order.findFirst({
          where: {
            id: session.metadata?.orderId,
          },
          include: {
            items: true,
            user: true,
          },
        })

        if (order) {
          await db.order.update({
            where: { id: order.id },
            data: {
              status: 'PAID',
              stripePaymentId: session.payment_intent as string,
              paymentStatus: 'paid',
            },
          })

          // Create fulfillment record
          await db.fulfillment.create({
            data: {
              orderId: order.id,
              status: 'PENDING',
            },
          })

          // Send confirmation email
          try {
            await sendOrderConfirmation({
              to: order.shippingEmail,
              orderNumber: order.orderNumber,
              orderTotal: formatPrice(Number(order.total)),
              orderItems: order.items.map((item: any) => ({
                name: item.name,
                quantity: item.quantity,
                price: formatPrice(Number(item.price)),
              })),
            })
          } catch (emailError) {
            console.error('Failed to send order confirmation email:', emailError)
          }
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge

        // Update order status to refunded
        await db.order.updateMany({
          where: {
            stripePaymentId: charge.payment_intent as string,
          },
          data: {
            status: 'REFUNDED',
            paymentStatus: 'refunded',
          },
        })
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
