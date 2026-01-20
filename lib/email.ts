import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not set - emails will not be sent')
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmation(params: {
  to: string
  orderNumber: string
  orderTotal: string
  orderItems: Array<{
    name: string
    quantity: number
    price: string
  }>
}) {
  const { to, orderNumber, orderTotal, orderItems } = params

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to,
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <h1>Thank you for your order!</h1>
        <p>Your order <strong>${orderNumber}</strong> has been confirmed.</p>
        
        <h2>Order Details:</h2>
        <ul>
          ${orderItems.map(item => `<li>${item.quantity}x ${item.name} - ${item.price}</li>`).join('')}
        </ul>
        
        <p><strong>Total: ${orderTotal}</strong></p>
        
        <p>You will receive a shipping confirmation email once your order has been shipped.</p>
        
        <p>Thank you for shopping with us!</p>
      `,
    })
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
  }
}

export async function sendShippingNotification(params: {
  to: string
  orderNumber: string
  trackingNumber: string
  trackingUrl?: string
  carrier?: string
}) {
  const { to, orderNumber, trackingNumber, trackingUrl, carrier } = params

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to,
      subject: `Your Order ${orderNumber} Has Shipped!`,
      html: `
        <h1>Your order has shipped!</h1>
        <p>Your order <strong>${orderNumber}</strong> is on its way.</p>
        
        <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
        ${carrier ? `<p><strong>Carrier:</strong> ${carrier}</p>` : ''}
        ${trackingUrl ? `<p><a href="${trackingUrl}">Track your package</a></p>` : ''}
        
        <p>Thank you for your order!</p>
      `,
    })
  } catch (error) {
    console.error('Failed to send shipping notification email:', error)
  }
}

export async function sendContactFormEmail(params: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const { name, email, subject, message } = params

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to: process.env.EMAIL_FROM || 'noreply@example.com',
      reply_to: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })
  } catch (error) {
    console.error('Failed to send contact form email:', error)
    throw new Error('Failed to send email')
  }
}
