# 🚀 Quick Start - Vine Dropshipping

## Before You Begin

You need to install Node.js first! Here's how:

### Step 1: Install Node.js

1. **Download Node.js:**
   - Visit: https://nodejs.org/
   - Download the **LTS version** (Long Term Support)
   - Current recommended: v20.x or v18.x

2. **Run the Installer:**
   - Double-click the downloaded file
   - Follow the installation wizard
   - Keep all default settings
   - ✅ Check "Automatically install necessary tools" if asked

3. **Verify Installation:**
   - Close and reopen PowerShell
   - Run: `node --version`
   - Should show: v20.x.x or v18.x.x
   - Run: `npm --version`
   - Should show: 10.x.x or higher

### Step 2: Install PostgreSQL (Database)

**Option A: Local Installation (Recommended for Learning)**

1. Download from: https://www.postgresql.org/download/windows/
2. Run installer, set a password (remember it!)
3. Keep default port: 5432
4. Your DATABASE_URL will be:
   ```
   postgresql://postgres:YOUR_PASSWORD@localhost:5432/vine_dropshipping
   ```

**Option B: Cloud Database (Recommended for Production)**

Use a free hosted database:

1. **Neon** (Recommended - easiest):
   - Go to: https://neon.tech
   - Sign up (free)
   - Create a project
   - Copy the connection string
   
2. **Supabase**:
   - Go to: https://supabase.com
   - Sign up (free)
   - Create project
   - Get connection string from Settings → Database

### Step 3: Get Stripe API Keys (For Payments)

1. Go to: https://dashboard.stripe.com/register
2. Sign up for a free account
3. Switch to **Test mode** (toggle in top right)
4. Go to: Developers → API keys
5. Copy:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Step 4: Run Setup

Once Node.js is installed, open PowerShell in this folder and run:

```powershell
# Run the automated setup script
.\setup.ps1
```

The script will:
- ✅ Check if Node.js is installed
- ✅ Install all dependencies
- ✅ Create .env file
- ✅ Guide you through database setup
- ✅ Seed sample data
- ✅ Start the development server

### Step 5: Manual Setup (Alternative)

If you prefer to do it manually:

```powershell
# 1. Install dependencies
npm install

# 2. Copy environment template
Copy-Item .env.example .env

# 3. Edit .env file
notepad .env
# Add your DATABASE_URL, NEXTAUTH_SECRET, and Stripe keys

# 4. Generate NextAuth secret
# Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
# Copy the output to NEXTAUTH_SECRET in .env

# 5. Setup database
npx prisma generate
npm run db:push
npm run db:seed

# 6. Start development server
npm run dev
```

### Step 6: Access Your Store

Open your browser and visit:

- **Storefront**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

**Login Credentials:**
- Admin: `admin@vine.com` / `admin123`
- User: `user@example.com` / `password123`

## Troubleshooting

### "npm is not recognized"

**Solution:** Node.js is not installed or not in PATH
1. Install Node.js from nodejs.org
2. Restart PowerShell
3. Try again

### "Cannot connect to database"

**Solution:** DATABASE_URL is incorrect or database isn't running
1. Check your DATABASE_URL in .env
2. If using local PostgreSQL, ensure it's running:
   ```powershell
   Get-Service postgresql*
   ```
3. Test connection:
   ```powershell
   npx prisma studio
   ```

### "Prisma Client is not generated"

**Solution:**
```powershell
npx prisma generate
```

### Port 3000 already in use

**Solution:** Use a different port
```powershell
npm run dev -- -p 3001
```

## What's Included?

Your store now has:

- ✨ Beautiful product catalog
- 🛒 Shopping cart (ready to implement)
- 💳 Stripe checkout integration
- 👤 User authentication
- 🔐 Admin dashboard
- 📦 Order management
- 🚚 Fulfillment tracking
- 📧 Email notifications
- 🌙 Dark mode
- 📱 Mobile responsive
- 🔍 SEO optimized

## Next Steps

1. **Customize Branding:**
   - Edit `app/layout.tsx` for site name
   - Update colors in `app/globals.css`
   - Replace logo in `components/header.tsx`

2. **Add Your Products:**
   - Go to http://localhost:3000/admin
   - Click "Products" → "Add Product"

3. **Test Checkout:**
   - Add products to cart
   - Use Stripe test card: `4242 4242 4242 4242`

4. **Read Documentation:**
   - `README.md` - Complete guide
   - `SETUP.md` - Detailed setup
   - `DEPLOYMENT.md` - Production deployment
   - `FEATURES.md` - All features
   - `TROUBLESHOOTING.md` - Common issues

## Need Help?

Check these files in order:
1. `QUICKSTART.md` (this file)
2. `TROUBLESHOOTING.md`
3. `README.md`

## Resources

- **Node.js**: https://nodejs.org/
- **PostgreSQL**: https://www.postgresql.org/
- **Neon** (Cloud DB): https://neon.tech
- **Stripe**: https://stripe.com/
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs

---

**Ready to build your dropshipping empire! 🚀**
