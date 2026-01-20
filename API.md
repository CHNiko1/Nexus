# API Documentation

REST API endpoints for the Vine Dropshipping platform.

## Base URL

```
Development: http://localhost:3000
Production: https://yourdomain.com
```

## Authentication

Most endpoints require authentication via NextAuth.js session cookies. Admin endpoints require ADMIN role.

### Headers

```
Content-Type: application/json
Cookie: next-auth.session-token=...
```

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Validation:**
- `name`: min 2 characters
- `email`: valid email format
- `password`: min 8 characters
- `confirmPassword`: must match password

**Success Response (201):**
```json
{
  "user": {
    "id": "clx123...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "error": "User with this email already exists"
}
```

**Example:**
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    confirmPassword: 'password123'
  })
})
```

### Login

**Endpoint:** `POST /api/auth/signin`

Handled by NextAuth.js. Use the signIn function from next-auth/react:

```typescript
import { signIn } from 'next-auth/react'

await signIn('credentials', {
  email: 'user@example.com',
  password: 'password123',
  redirect: false
})
```

### Logout

**Endpoint:** `POST /api/auth/signout`

```typescript
import { signOut } from 'next-auth/react'

await signOut({ redirect: false })
```

---

## Checkout Endpoints

### Create Checkout Session

Create a Stripe checkout session for an order.

**Endpoint:** `POST /api/checkout`

**Authentication:** Required (USER or ADMIN)

**Request Body:**
```json
{
  "items": [
    {
      "productId": "clx123...",
      "quantity": 2,
      "variant": "Large / Blue"
    }
  ],
  "shippingInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "US"
  }
}
```

**Validation:**
- All items must exist in database
- All shipping fields required
- Valid email format
- Phone min 10 characters

**Success Response (200):**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

**Error Responses:**

```json
// 401 Unauthorized
{
  "error": "Unauthorized"
}

// 400 Bad Request
{
  "error": "No items in cart"
}

// 400 Bad Request
{
  "error": "Product {productId} not found"
}
```

**Usage Flow:**
1. Collect cart items and shipping info
2. Create checkout session
3. Redirect user to Stripe checkout URL
4. Stripe handles payment
5. Webhook updates order status

**Example:**
```typescript
const response = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: [
      { productId: 'clx123', quantity: 1 }
    ],
    shippingInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'US'
    }
  })
})

const { url } = await response.json()
window.location.href = url // Redirect to Stripe
```

---

## Contact Endpoints

### Send Contact Message

Submit a contact form message.

**Endpoint:** `POST /api/contact`

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about product",
  "message": "I have a question about..."
}
```

**Validation:**
- `name`: min 2 characters
- `email`: valid email format
- `subject`: min 5 characters
- `message`: min 10 characters

**Success Response (200):**
```json
{
  "success": true
}
```

**Error Response (500):**
```json
{
  "error": "Failed to send message"
}
```

**Example:**
```typescript
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Product inquiry',
    message: 'I would like to know more about...'
  })
})
```

---

## Webhook Endpoints

### Stripe Webhook

Receives webhook events from Stripe.

**Endpoint:** `POST /api/webhooks/stripe`

**Authentication:** Stripe signature verification

**Headers Required:**
```
stripe-signature: t=...,v1=...
```

**Supported Events:**

1. **checkout.session.completed**
   - Updates order status to PAID
   - Creates fulfillment record
   - Sends order confirmation email

2. **charge.refunded**
   - Updates order status to REFUNDED

**Webhook Payload Example:**
```json
{
  "id": "evt_...",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_...",
      "payment_intent": "pi_...",
      "metadata": {
        "orderId": "clx123...",
        "orderNumber": "ORD-..."
      }
    }
  }
}
```

**Success Response (200):**
```json
{
  "received": true
}
```

**Error Responses:**

```json
// 400 Invalid Signature
{
  "error": "Invalid signature"
}

// 500 Processing Error
{
  "error": "Webhook handler failed"
}
```

**Setup:**

Development:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Production:
```
Create webhook in Stripe Dashboard:
URL: https://yourdomain.com/api/webhooks/stripe
Events: checkout.session.completed, charge.refunded
```

---

## Admin API Endpoints

### Product Management

#### Create Product

**Endpoint:** `POST /api/admin/products`

**Authentication:** Required (ADMIN role)

**Request Body:**
```json
{
  "name": "Wireless Headphones",
  "slug": "wireless-headphones",
  "description": "Premium headphones...",
  "price": 149.99,
  "compareAtPrice": 199.99,
  "cost": 75.00,
  "stock": 50,
  "categoryId": "clx123...",
  "supplier": "TechSupply Co.",
  "sku": "WH-001",
  "tags": ["audio", "wireless"],
  "featured": true,
  "published": true
}
```

#### Update Product

**Endpoint:** `PUT /api/admin/products/:id`

**Authentication:** Required (ADMIN role)

#### Delete Product

**Endpoint:** `DELETE /api/admin/products/:id`

**Authentication:** Required (ADMIN role)

### Order Management

#### Update Order Status

**Endpoint:** `PATCH /api/admin/orders/:id`

**Authentication:** Required (ADMIN role)

**Request Body:**
```json
{
  "status": "SHIPPED"
}
```

#### Update Fulfillment

**Endpoint:** `PATCH /api/admin/orders/:id/fulfillment`

**Authentication:** Required (ADMIN role)

**Request Body:**
```json
{
  "status": "SHIPPED",
  "trackingNumber": "1Z999AA10123456784",
  "trackingCarrier": "UPS",
  "trackingUrl": "https://www.ups.com/track?tracknum=...",
  "notes": "Shipped via UPS Ground"
}
```

---

## Error Responses

All API endpoints follow a consistent error format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful request |
| 201 | Created | Resource successfully created |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server-side error |

---

## Rate Limiting

Currently not implemented but recommended for production:

```typescript
// Suggested implementation
const rateLimits = {
  '/api/auth/register': { max: 5, window: '15m' },
  '/api/checkout': { max: 10, window: '1m' },
  '/api/contact': { max: 3, window: '1h' },
}
```

---

## Server Actions (Alternative to API Routes)

The platform also uses Server Actions for form submissions:

### Example Server Action

```typescript
'use server'

export async function createProduct(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }
  
  const data = {
    name: formData.get('name'),
    price: formData.get('price'),
    // ...
  }
  
  await db.product.create({ data })
  revalidatePath('/admin/products')
}
```

---

## GraphQL (Not Implemented)

This platform uses REST APIs. For GraphQL implementation, consider:
- Apollo Server
- GraphQL Yoga
- Pothos GraphQL

---

## Testing API Endpoints

### Using curl

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","confirmPassword":"password123"}'

# Contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","subject":"Test","message":"Test message"}'
```

### Using Postman

1. Import collection (create one from this documentation)
2. Set base URL variable
3. Test endpoints sequentially

### Using JavaScript

```typescript
// Helper function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Request failed')
  }
  
  return response.json()
}

// Usage
try {
  const data = await apiRequest('/api/contact', {
    method: 'POST',
    body: JSON.stringify({ /* ... */ }),
  })
  console.log('Success:', data)
} catch (error) {
  console.error('Error:', error)
}
```

---

## Best Practices

1. **Always validate input** - Use Zod schemas
2. **Handle errors gracefully** - Return meaningful error messages
3. **Use proper HTTP status codes** - Match status to response type
4. **Rate limit sensitive endpoints** - Prevent abuse
5. **Log API requests** - For debugging and monitoring
6. **Implement authentication** - Protect sensitive endpoints
7. **Version your API** - Use /api/v1/ for future compatibility

---

## Security Considerations

1. **Never expose sensitive data**
   ```typescript
   // Bad
   return { user: user }
   
   // Good
   return { user: { id: user.id, email: user.email } }
   ```

2. **Validate all inputs**
   ```typescript
   const schema = z.object({ email: z.string().email() })
   const data = schema.parse(body)
   ```

3. **Use HTTPS in production**

4. **Implement CORS properly**
   ```typescript
   // Already configured in Next.js
   ```

5. **Sanitize user input**
   ```typescript
   import { sanitizeHtml } from '@/lib/utils'
   const clean = sanitizeHtml(userInput)
   ```

---

## Additional Resources

- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Stripe API Docs](https://stripe.com/docs/api)
- [Prisma API Reference](https://www.prisma.io/docs/reference/api-reference)
- [NextAuth.js API](https://next-auth.js.org/getting-started/rest-api)

---

Need more endpoints? This platform is designed to be extended easily. Add new routes in `/app/api/` following the existing patterns.
