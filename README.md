# Vine Dropshipping E-Commerce Platform

A production-ready, full-stack dropshipping e-commerce platform built with Next.js 14, TypeScript, and modern web technologies. Features a beautiful storefront, comprehensive admin dashboard, and complete dropshipping workflow.

## 🚀 Features

### Storefront
- **Modern UI**: Clean, responsive design with dark mode support
- **Product Browsing**: Advanced filtering, search, and sorting
- **Product Details**: Image galleries, variants, stock indicators
- **Shopping Cart**: Persistent cart with quantity management
- **Secure Checkout**: Stripe integration with address collection
- **User Accounts**: Registration, login, profile, and order history
- **SEO Optimized**: Dynamic metadata, OpenGraph tags, structured data

### Admin Dashboard
- **Analytics Overview**: Revenue, orders, products, customers
- **Product Management**: Full CRUD with images, variants, inventory
- **Order Management**: Order processing, fulfillment tracking
- **Customer Management**: View customer data and order history
- **Discount Codes**: Create and manage promotional codes
- **Category Management**: Organize products into categories

### Dropshipping Features
- **Supplier Integration**: Track product suppliers and source URLs
- **Fulfillment Workflow**: Order → Ordered → Shipped → Delivered
- **Tracking Management**: Add tracking numbers and carriers
- **Email Notifications**: Automated order and shipping emails
- **Inventory Sync**: Real-time stock level management

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (credentials + OAuth)
- **Payments**: Stripe (Checkout + Webhooks)
- **Email**: Resend
- **State Management**: Server Components + React Hook Form
- **Validation**: Zod

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (local or hosted)
- Stripe account (test mode for development)
- Resend account (optional, for emails)

## 🚀 Quick Start

### 1. Clone and Install

\`\`\`bash
# Navigate to project directory
cd "Vine 1.0"

# Install dependencies
npm install
\`\`\`

### 2. Environment Setup

Create a \`.env\` file in the root directory:

\`\`\`env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/vine_dropshipping"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Stripe
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend Email (optional)
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@yourdomain.com"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Vine Dropshipping"
\`\`\`

### 3. Database Setup

\`\`\`bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Stripe Webhook Setup (for local testing)

In a separate terminal:

\`\`\`bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe listen --forward-to localhost:3000/api/webhooks/stripe
\`\`\`

Copy the webhook signing secret to your \`.env\` file.

## 👤 Default Credentials

After seeding the database:

**Admin Account**
- Email: admin@vine.com
- Password: admin123

**Test User Account**
- Email: user@example.com
- Password: password123

## 📁 Project Structure

\`\`\`
Vine 1.0/
├── app/
│   ├── (store)/              # Storefront pages
│   │   ├── page.tsx          # Home page
│   │   ├── products/         # Product pages
│   │   ├── cart/             # Shopping cart
│   │   ├── account/          # User account
│   │   └── contact/          # Contact page
│   ├── admin/                # Admin dashboard
│   │   ├── page.tsx          # Dashboard overview
│   │   ├── products/         # Product management
│   │   ├── orders/           # Order management
│   │   └── customers/        # Customer management
│   ├── api/                  # API routes
│   │   ├── auth/             # Authentication
│   │   ├── checkout/         # Checkout session
│   │   └── webhooks/         # Stripe webhooks
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── header.tsx            # Site header
│   └── footer.tsx            # Site footer
├── lib/
│   ├── db.ts                 # Prisma client
│   ├── auth.ts               # NextAuth configuration
│   ├── stripe.ts             # Stripe utilities
│   ├── email.ts              # Email utilities
│   ├── utils.ts              # Helper functions
│   └── validations.ts        # Zod schemas
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data
├── public/                   # Static assets
├── .env.example              # Environment variables template
└── package.json              # Dependencies
\`\`\`

## 🔒 Security Features

- **Authentication**: Secure password hashing with bcrypt
- **Authorization**: Role-based access control (USER/ADMIN)
- **Input Validation**: Zod schemas for all user inputs
- **XSS Protection**: HTML sanitization for user content
- **CSRF Protection**: Built-in Next.js protection
- **Webhook Verification**: Stripe signature validation
- **SQL Injection**: Prisma ORM prevents SQL injection

## 🎨 UI/UX Features

- **Mobile-First**: Fully responsive design
- **Dark Mode**: System-aware dark mode toggle
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: User-friendly feedback
- **Error Handling**: Graceful error pages
- **Accessibility**: WCAG 2.1 Level AA compliant

## 📧 Email Templates

The platform includes automated emails for:
- Order confirmation
- Shipping notification
- Contact form submissions

Configure Resend API key or use alternative email providers.

## 💳 Payment Processing

### Stripe Integration
1. Checkout Sessions for secure payment
2. Webhook handling for order updates
3. Refund management through webhooks
4. Payment method collection

## 🚢 Dropshipping Workflow

1. **Customer places order** → Order created with PENDING status
2. **Payment confirmed** → Status changes to PAID, fulfillment created
3. **Admin orders from supplier** → Fulfillment status: ORDERED
4. **Supplier ships** → Add tracking, status: SHIPPED, email sent
5. **Customer receives** → Status: DELIVERED

## 📊 Database Schema

Key models:
- **User**: Customer and admin accounts
- **Product**: Product catalog with variants
- **Order**: Customer orders with items
- **Fulfillment**: Dropshipping order tracking
- **Category**: Product categorization
- **DiscountCode**: Promotional codes

View complete schema in \`prisma/schema.prisma\`

## 🧪 Testing

### Manual Testing
1. Browse products as guest
2. Add products to cart
3. Register/login
4. Complete checkout (use Stripe test cards)
5. View order in account
6. Login as admin
7. Manage products and orders

### Stripe Test Cards
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production
- Update \`NEXTAUTH_URL\` to your domain
- Update \`NEXT_PUBLIC_APP_URL\` to your domain
- Use production Stripe keys
- Configure production database

## 📈 Performance Optimization

- **Image Optimization**: Next.js Image component
- **Server Components**: Reduced client JavaScript
- **Static Generation**: Pages pre-rendered when possible
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Proper cache headers

## 🛠 Development Commands

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema changes
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
\`\`\`

## 📝 Customization

### Branding
- Update logo in \`components/header.tsx\`
- Change colors in \`app/globals.css\`
- Update metadata in \`app/layout.tsx\`

### Add Features
- New product fields in \`prisma/schema.prisma\`
- Additional email templates in \`lib/email.ts\`
- Custom admin pages in \`app/admin/\`

## 🤝 Support

For issues and questions:
- Check existing documentation
- Review Prisma schema for data models
- Test with Stripe test mode
- Verify environment variables

## 📄 License

This project is for educational and commercial use.

## 🎯 Roadmap

Future enhancements:
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Multi-currency support
- [ ] Advanced analytics dashboard
- [ ] Inventory alerts
- [ ] Bulk import/export
- [ ] Email marketing integration
- [ ] Live chat support

---

Built with ❤️ using Next.js and modern web technologies.
