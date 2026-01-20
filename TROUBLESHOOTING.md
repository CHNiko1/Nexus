# Troubleshooting Guide

Common issues and solutions for the Vine Dropshipping platform.

## 🚨 Installation Issues

### "npm install" fails

**Symptoms:**
- Error messages during package installation
- Missing dependencies

**Solutions:**

1. **Clear npm cache:**
```powershell
npm cache clean --force
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

2. **Use correct Node version:**
```powershell
node --version  # Should be 18.x or higher
```

3. **Run as administrator (if permission errors):**
```powershell
# Right-click PowerShell → Run as Administrator
npm install
```

### "Cannot find module" errors

**Solution:**
```powershell
npx prisma generate
npm install
```

## 🗄️ Database Issues

### Cannot connect to database

**Symptoms:**
- "Can't reach database server"
- Connection timeout errors

**Solutions:**

1. **Check PostgreSQL is running:**
```powershell
# Check if PostgreSQL service is running
Get-Service postgresql*
```

2. **Verify DATABASE_URL:**
```powershell
# Check .env file
Get-Content .env | Select-String "DATABASE_URL"
```

3. **Test connection:**
```powershell
npx prisma db pull
```

4. **Common URL formats:**
```
# Local PostgreSQL
postgresql://postgres:password@localhost:5432/vine_dropshipping

# Neon
postgresql://user:password@ep-xxx-xxx.region.neon.tech/dbname

# Supabase
postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

### Prisma migration errors

**Solution:**
```powershell
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Or push schema without migration
npx prisma db push

# Regenerate Prisma Client
npx prisma generate
```

### "Table already exists" error

**Solution:**
```powershell
# Option 1: Use db push (doesn't use migrations)
npx prisma db push

# Option 2: Reset and start fresh
npx prisma migrate reset
npx prisma db push
npm run db:seed
```

### Seed data fails

**Symptoms:**
- Errors when running `npm run db:seed`
- Unique constraint violations

**Solutions:**

1. **Clear existing data:**
```powershell
npx prisma studio
# Manually delete records, then try seeding again
```

2. **Reset and re-seed:**
```powershell
npx prisma migrate reset --skip-seed
npm run db:seed
```

## 🔐 Authentication Issues

### Cannot login after registration

**Symptoms:**
- "Invalid credentials" error
- Login fails with correct password

**Solutions:**

1. **Check user was created:**
```powershell
npx prisma studio
# Look in users table
```

2. **Verify NEXTAUTH_SECRET is set:**
```powershell
Get-Content .env | Select-String "NEXTAUTH_SECRET"
```

3. **Clear browser cookies and try again**

### Session expires immediately

**Solution:**

1. **Check NEXTAUTH_URL matches your domain:**
```env
# Development
NEXTAUTH_URL=http://localhost:3000

# Production
NEXTAUTH_URL=https://yourdomain.com
```

2. **Restart dev server:**
```powershell
# Ctrl+C to stop
npm run dev
```

### Google OAuth not working

**Solutions:**

1. **Verify credentials are set:**
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
```

2. **Check authorized redirect URIs in Google Console:**
```
http://localhost:3000/api/auth/callback/google
https://yourdomain.com/api/auth/callback/google
```

3. **Enable Google OAuth API**

### "NEXTAUTH_SECRET" error

**Solution:**

Generate a new secret:
```powershell
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Add to `.env`:
```env
NEXTAUTH_SECRET=your-generated-secret
```

## 💳 Stripe Issues

### Checkout not working

**Symptoms:**
- "Failed to create checkout session"
- Redirect to checkout doesn't work

**Solutions:**

1. **Verify Stripe keys:**
```powershell
Get-Content .env | Select-String "STRIPE"
```

2. **Check keys match environment:**
```
Development: pk_test_... and sk_test_...
Production: pk_live_... and sk_live_...
```

3. **Test with Stripe CLI:**
```powershell
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Webhooks not working

**Symptoms:**
- Orders stay in PENDING status
- Payment confirmed but order not updated

**Solutions:**

1. **Check webhook secret:**
```powershell
Get-Content .env | Select-String "STRIPE_WEBHOOK_SECRET"
```

2. **Verify webhook is running:**
```powershell
# In separate terminal
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

3. **Check webhook endpoint in Stripe Dashboard:**
```
Development: Use Stripe CLI
Production: https://yourdomain.com/api/webhooks/stripe
```

4. **Verify webhook events:**
- Should listen to: `checkout.session.completed`, `charge.refunded`

5. **Check function logs:**
```powershell
# In Vercel Dashboard: Deployments → View Function Logs
```

### "Invalid signature" webhook error

**Solution:**

1. **Get new webhook secret:**
```powershell
# Development
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy the webhook signing secret

# Production
# Get from Stripe Dashboard → Webhooks → Your endpoint
```

2. **Update .env:**
```env
STRIPE_WEBHOOK_SECRET=whsec_your_new_secret
```

3. **Restart server**

## 📧 Email Issues

### Emails not sending

**Symptoms:**
- No order confirmation emails
- Contact form submissions don't send

**Solutions:**

1. **Check Resend API key:**
```powershell
Get-Content .env | Select-String "RESEND_API_KEY"
```

2. **Verify email from address:**
```env
EMAIL_FROM=noreply@yourdomain.com
```

3. **Check Resend dashboard for errors:**
- Go to resend.com → Logs

4. **Test in development:**
```typescript
// The email service logs errors to console
// Check terminal for error messages
```

### Emails going to spam

**Solutions:**

1. **Verify domain in Resend:**
- Add DNS records
- Wait for verification

2. **Use proper from address:**
```env
# Good
EMAIL_FROM=orders@yourdomain.com

# May trigger spam filters
EMAIL_FROM=noreply@gmail.com
```

3. **Check email content:**
- Avoid spam trigger words
- Include unsubscribe link (for marketing)

## 🖼️ Image Issues

### Images not displaying

**Symptoms:**
- Broken image icons
- 404 errors for images

**Solutions:**

1. **Check image URL format:**
```typescript
// Should be absolute URL or path in /public
const imageUrl = 'https://images.unsplash.com/...'
// or
const imageUrl = '/images/product.jpg'
```

2. **Verify Next.js Image domains:**

In `next.config.js`:
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
    // Add your image CDN here
  ],
}
```

3. **Restart dev server after config changes**

### Images slow to load

**Solutions:**

1. **Use Next/Image component:**
```tsx
import Image from 'next/image'

<Image src="..." alt="..." width={800} height={800} />
```

2. **Optimize image sizes:**
- Use appropriate dimensions
- Compress images before upload
- Use WebP format

3. **Add priority to above-fold images:**
```tsx
<Image src="..." priority />
```

## 🚀 Build & Deployment Issues

### Build fails

**Symptoms:**
- `npm run build` fails
- Type errors during build

**Solutions:**

1. **Check TypeScript errors:**
```powershell
npx tsc --noEmit
```

2. **Clear Next.js cache:**
```powershell
Remove-Item -Recurse -Force .next
npm run build
```

3. **Fix environment variables:**
```powershell
# Ensure all required variables are set
Get-Content .env.example
```

### Vercel deployment fails

**Solutions:**

1. **Check build logs in Vercel Dashboard**

2. **Verify environment variables are set in Vercel**

3. **Check build command:**
```
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

4. **Database connectivity:**
```
# Ensure DATABASE_URL is accessible from Vercel
# Whitelist Vercel IPs if needed
```

### Database not initialized on Vercel

**Solution:**

From local machine with production DATABASE_URL:
```powershell
$env:DATABASE_URL="your-production-url"
npx prisma db push
npm run db:seed
$env:DATABASE_URL=""
```

## 🎨 Styling Issues

### Tailwind classes not working

**Solutions:**

1. **Check Tailwind config:**
```javascript
// tailwind.config.ts
content: [
  './pages/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
  './app/**/*.{ts,tsx}',
]
```

2. **Restart dev server:**
```powershell
npm run dev
```

3. **Clear browser cache**

### Dark mode not working

**Solution:**

1. **Check ThemeProvider is in layout:**
```tsx
// app/layout.tsx
<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
```

2. **Verify dark mode classes in Tailwind config**

3. **Check browser dev tools for class changes**

## ⚡ Performance Issues

### Slow page loads

**Solutions:**

1. **Check database queries:**
```typescript
// Use Prisma query logging
const products = await db.product.findMany({
  // Limit results
  take: 20,
  // Only select needed fields
  select: { id: true, name: true, price: true },
  // Use proper indexes
})
```

2. **Optimize images:**
- Use Next/Image
- Proper sizing
- Lazy loading

3. **Enable caching:**
```typescript
// Add to fetch or API routes
export const revalidate = 3600 // 1 hour
```

4. **Check Network tab in browser dev tools**

### High memory usage

**Solutions:**

1. **Increase Node memory (if needed):**
```json
// package.json
{
  "scripts": {
    "dev": "NODE_OPTIONS='--max-old-space-size=4096' next dev"
  }
}
```

2. **Close Prisma connections:**
```typescript
await prisma.$disconnect()
```

## 🔍 SEO Issues

### Sitemap not generating

**Solution:**

1. **Check sitemap.ts file exists in app directory**

2. **Test sitemap generation:**
```
Visit: http://localhost:3000/sitemap.xml
```

3. **Verify database connection in sitemap.ts**

### Meta tags not showing

**Solutions:**

1. **Check metadata in page files:**
```typescript
export const metadata = {
  title: 'Page Title',
  description: 'Description'
}
```

2. **View page source (not dev tools):**
```
Right-click → View Page Source
```

3. **For dynamic metadata:**
```typescript
export async function generateMetadata({ params }) {
  return {
    title: 'Dynamic Title'
  }
}
```

## 🛠️ Development Issues

### Hot reload not working

**Solutions:**

1. **Restart dev server:**
```powershell
# Ctrl+C to stop
npm run dev
```

2. **Clear .next folder:**
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

3. **Check for syntax errors**

### Port already in use

**Solution:**

1. **Use different port:**
```powershell
npm run dev -- -p 3001
```

2. **Kill process using port 3000:**
```powershell
# Find process
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID 12345 /F
```

## 📱 Mobile Issues

### Layout broken on mobile

**Solutions:**

1. **Check responsive classes:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

2. **Test in browser dev tools:**
```
F12 → Toggle device toolbar → Select mobile device
```

3. **Check viewport meta tag:**
```tsx
// Should be in layout.tsx
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

## 🆘 Getting More Help

### Check Logs

**Development:**
```powershell
# Terminal shows server logs
# Browser console shows client errors (F12)
```

**Production (Vercel):**
```
Dashboard → Deployments → Your deployment → View Function Logs
```

### Debug Mode

Enable detailed logging:
```typescript
// In any file
console.log('Debug info:', variable)
```

### Database Inspection

```powershell
# Open Prisma Studio
npm run db:studio
# Opens at http://localhost:5555
```

### Common Error Patterns

| Error Message | Likely Cause | Solution |
|--------------|--------------|----------|
| "Module not found" | Missing dependency or wrong import | Run `npm install`, check import path |
| "Cannot connect to database" | Wrong DATABASE_URL or DB not running | Check .env, start PostgreSQL |
| "Invalid credentials" | Wrong password or user not found | Check database, verify input |
| "Webhook signature verification failed" | Wrong STRIPE_WEBHOOK_SECRET | Update webhook secret in .env |
| "Failed to send email" | Wrong RESEND_API_KEY or from address | Check Resend dashboard |
| "Type error" | TypeScript type mismatch | Check types, run `npx tsc` |

### Still Stuck?

1. **Check the documentation:**
   - README.md
   - SETUP.md
   - DEPLOYMENT.md

2. **Review the code:**
   - Look at similar working examples
   - Check for typos

3. **Search for error messages:**
   - Google the exact error
   - Check GitHub issues for dependencies

4. **Resources:**
   - [Next.js Docs](https://nextjs.org/docs)
   - [Prisma Docs](https://prisma.io/docs)
   - [Stripe Docs](https://stripe.com/docs)
   - [Tailwind Docs](https://tailwindcss.com/docs)

---

## Quick Diagnostic Checklist

When something doesn't work, check:

- [ ] Did you run `npm install`?
- [ ] Is your `.env` file configured?
- [ ] Did you run `npx prisma generate`?
- [ ] Did you run `npm run db:push`?
- [ ] Is PostgreSQL running?
- [ ] Did you restart the dev server?
- [ ] Are there any errors in the terminal?
- [ ] Are there any errors in browser console (F12)?
- [ ] Did you clear browser cache?
- [ ] Are environment variables correct?

Most issues are solved by restarting the dev server and clearing caches! 🔄
