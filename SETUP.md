# Quick Start Guide - Vine Dropshipping

## Prerequisites Checklist

Before starting, ensure you have:

- ✅ Node.js 18+ installed ([Download](https://nodejs.org/))
- ✅ PostgreSQL installed or access to a database ([Download](https://www.postgresql.org/download/))
- ✅ Stripe account created ([Sign up](https://stripe.com))
- ✅ Resend account created (optional, for emails) ([Sign up](https://resend.com))

## Step-by-Step Setup

### 1. Install Dependencies

Open PowerShell in the project directory and run:

```powershell
npm install
```

This will install all required packages (~2-3 minutes).

### 2. Set Up Database

#### Option A: Local PostgreSQL

If you have PostgreSQL installed locally:

```powershell
# Create database
psql -U postgres -c "CREATE DATABASE vine_dropshipping;"

# Your DATABASE_URL will be:
# postgresql://postgres:YOUR_PASSWORD@localhost:5432/vine_dropshipping
```

#### Option B: Cloud Database (Recommended for Production)

Use a hosted database service:
- [Neon](https://neon.tech) (Recommended - Free tier available)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)

They'll provide you with a DATABASE_URL.

### 3. Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/vine_dropshipping"

# NextAuth - Generate secret with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="YOUR_GENERATED_SECRET_HERE"

# Stripe (Get from https://dashboard.stripe.com/test/apikeys)
STRIPE_PUBLIC_KEY="pk_test_YOUR_KEY"
STRIPE_SECRET_KEY="sk_test_YOUR_KEY"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_SECRET"  # We'll set this up later

# Resend (Optional - from https://resend.com/api-keys)
RESEND_API_KEY="re_YOUR_KEY"
EMAIL_FROM="noreply@yourdomain.com"

# App URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Vine Dropshipping"
```

#### Getting Your Stripe Keys:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy "Publishable key" → `STRIPE_PUBLIC_KEY`
3. Copy "Secret key" → `STRIPE_SECRET_KEY`
4. Keep the tab open - we'll need it for webhooks

#### Generate NextAuth Secret:

**Windows PowerShell:**
```powershell
# Generate random secret
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Or use any 32+ character random string.

### 4. Initialize Database

```powershell
# Generate Prisma Client
npx prisma generate

# Create tables in database
npm run db:push

# Seed with sample data (10 products, admin user, etc.)
npm run db:seed
```

**Note the credentials printed:**
- Admin: admin@vine.com / admin123
- User: user@example.com / password123

### 5. Run Development Server

```powershell
npm run dev
```

Open http://localhost:3000 - you should see the homepage!

### 6. Set Up Stripe Webhooks (for checkout to work)

**Option A: Using Stripe CLI (Recommended for Development)**

1. Install Stripe CLI:
   ```powershell
   # Using Scoop (install Scoop first from scoop.sh)
   scoop install stripe
   
   # Or download from: https://github.com/stripe/stripe-cli/releases
   ```

2. Login to Stripe:
   ```powershell
   stripe login
   ```

3. Forward webhooks (in a new terminal):
   ```powershell
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook secret (starts with `whsec_`) to your `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET="whsec_xxxxx"
   ```

5. Restart your dev server

**Option B: Skip Webhooks for Now**

You can test the site without webhooks, but orders won't automatically update to "PAID" status.

### 7. Test the Site

1. **Browse products**: http://localhost:3000/products
2. **Register account**: http://localhost:3000/register
3. **Login**: http://localhost:3000/login
4. **Admin panel**: http://localhost:3000/admin (use admin credentials)

### 8. Test Checkout (Optional)

1. Add products to cart
2. Proceed to checkout
3. Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

## Common Issues & Solutions

### "Can't connect to database"

- ✅ Check DATABASE_URL is correct
- ✅ Ensure PostgreSQL is running
- ✅ Try: `npx prisma studio` to test connection

### "Module not found" errors

```powershell
# Clear and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Port 3000 already in use

```powershell
# Use different port
npm run dev -- -p 3001
```

### Prisma errors

```powershell
# Reset and regenerate
npx prisma generate
npm run db:push
```

## Project Structure Overview

```
Vine 1.0/
├── app/
│   ├── (store)/          # Public storefront pages
│   │   ├── page.tsx      # Homepage
│   │   ├── products/     # Product listing & details
│   │   ├── contact/      # Contact form
│   │   └── ...
│   ├── admin/            # Admin dashboard (protected)
│   │   ├── page.tsx      # Dashboard
│   │   ├── products/     # Product management
│   │   ├── orders/       # Order management
│   │   └── ...
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication
│   │   ├── checkout/     # Stripe checkout
│   │   └── webhooks/     # Stripe webhooks
│   └── ...
├── components/           # Reusable UI components
├── lib/                  # Utilities (db, auth, stripe, etc.)
├── prisma/              # Database schema & seed
└── public/              # Static files
```

## Next Steps

1. **Customize Branding**
   - Edit site name in `app/layout.tsx`
   - Update colors in `app/globals.css`
   - Replace logo in `components/header.tsx`

2. **Add Your Products**
   - Go to http://localhost:3000/admin/products
   - Click "Add Product"
   - Or modify `prisma/seed.ts` and re-run `npm run db:seed`

3. **Configure Email**
   - Sign up for [Resend](https://resend.com)
   - Add API key to `.env`
   - Test contact form and order emails

4. **Customize Policies**
   - Edit policy pages in `app/(store)/`
   - Update shipping zones and costs in code

## Production Deployment

When ready to deploy:

1. **Push to GitHub**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repo
   - Add all environment variables from `.env`
   - Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your domain
   - Deploy!

3. **Set Up Production Database**
   - Use [Neon](https://neon.tech) or [Supabase](https://supabase.com)
   - Update `DATABASE_URL` in Vercel
   - Run: `npx prisma db push` from local with production DATABASE_URL

4. **Configure Production Stripe**
   - Create production webhook in Stripe Dashboard
   - Point to: `https://yourdomain.com/api/webhooks/stripe`
   - Update to production Stripe keys

## Useful Commands

```powershell
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:push         # Sync schema to database
npm run db:seed         # Add sample data
npm run db:studio       # Open Prisma Studio (GUI)

# Code Quality
npm run lint            # Check for issues

# Stripe
stripe listen           # Listen for webhooks
```

## Getting Help

- **Documentation**: See README.md for full documentation
- **Database GUI**: Run `npm run db:studio` to browse data
- **Stripe Dashboard**: [dashboard.stripe.com](https://dashboard.stripe.com)
- **Prisma Docs**: [prisma.io/docs](https://www.prisma.io/docs)

## Features Checklist

Your store now has:

- ✅ Beautiful, responsive storefront
- ✅ Product catalog with search & filtering
- ✅ Shopping cart functionality
- ✅ Secure Stripe checkout
- ✅ User authentication (register/login)
- ✅ Admin dashboard
- ✅ Order management
- ✅ Fulfillment tracking
- ✅ Email notifications
- ✅ SEO optimization
- ✅ Dark mode support

Happy building! 🚀
