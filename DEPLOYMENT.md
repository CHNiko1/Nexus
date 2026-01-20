# Deployment Guide

This guide covers deploying your Vine Dropshipping platform to production.

## Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] Database schema finalized
- [ ] Stripe configured and tested
- [ ] Email service set up
- [ ] Custom domain purchased (optional)

## Recommended Stack

**Hosting**: Vercel (Free tier available, optimized for Next.js)
**Database**: Neon or Supabase (Free tier with PostgreSQL)
**Email**: Resend (Free tier: 3000 emails/month)
**Payments**: Stripe (Production mode)

## Step 1: Prepare Your Code

### Update Production URLs

In your `.env.example`, note that these will change:

```env
NEXTAUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Commit Your Code

```bash
git init
git add .
git commit -m "Initial commit - Vine Dropshipping v1.0"
```

### Push to GitHub

```bash
# Create a new repository on GitHub
# Then push your code:
git remote add origin https://github.com/yourusername/vine-dropshipping.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up Production Database

### Using Neon (Recommended)

1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a new project
3. Create a database named `vine_dropshipping`
4. Copy the connection string (it looks like: `postgresql://user:password@region.neon.tech/dbname`)
5. Save this as your production `DATABASE_URL`

### Using Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (Transaction mode)
5. Save as `DATABASE_URL`

## Step 3: Deploy to Vercel

### Initial Deployment

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### Environment Variables

Click "Environment Variables" and add ALL variables from your `.env`:

**Required Variables:**

```
DATABASE_URL=postgresql://... (from Neon/Supabase)
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=(generate new: openssl rand -base64 32)
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=(we'll update this after webhook setup)
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=Vine Dropshipping
```

**Optional but Recommended:**

```
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
```

**Important Notes:**
- Use PRODUCTION Stripe keys (pk_live_... and sk_live_...)
- Keep NEXTAUTH_SECRET secure and different from development
- Update URLs to match your Vercel domain

### Deploy

1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Your site will be live at `https://your-project.vercel.app`

## Step 4: Initialize Production Database

### Option A: From Local Machine

```bash
# Set production DATABASE_URL temporarily
$env:DATABASE_URL="postgresql://..." # Your production URL

# Push schema
npx prisma db push

# Seed data (optional - creates sample products and admin user)
npm run db:seed

# Unset the variable
$env:DATABASE_URL=""
```

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run commands in production environment
vercel env pull .env.production
npx prisma db push
```

## Step 5: Configure Production Stripe

### Set Up Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Switch to **Live mode** (toggle in top right)
3. Go to Developers → Webhooks
4. Click "Add endpoint"
5. Enter webhook URL: `https://your-domain.vercel.app/api/webhooks/stripe`
6. Select events to listen for:
   - `checkout.session.completed`
   - `charge.refunded`
7. Click "Add endpoint"
8. Copy the **Signing secret** (starts with `whsec_`)

### Update Webhook Secret

In Vercel:
1. Go to Project Settings → Environment Variables
2. Update `STRIPE_WEBHOOK_SECRET` with the new live webhook secret
3. Redeploy for changes to take effect

## Step 6: Set Up Custom Domain (Optional)

### In Vercel

1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Follow DNS configuration instructions

### Update DNS

Add these records at your domain provider:

**For root domain (yourdomain.com):**
- Type: A
- Name: @
- Value: 76.76.21.21

**For www subdomain:**
- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com

### Update Environment Variables

After domain is configured:
1. Update `NEXTAUTH_URL` to `https://yourdomain.com`
2. Update `NEXT_PUBLIC_APP_URL` to `https://yourdomain.com`
3. Update Stripe webhook URL to new domain
4. Redeploy

## Step 7: Configure Production Email

### Using Resend

1. Go to [resend.com](https://resend.com)
2. Add and verify your domain (or use their free domain)
3. Get API key from API Keys section
4. Add to Vercel environment variables:
   - `RESEND_API_KEY`
   - `EMAIL_FROM` (e.g., `orders@yourdomain.com`)

### Verify Email Sending

1. Test contact form on production site
2. Place a test order (use Stripe test mode first)
3. Check email delivery

## Step 8: Production Testing

### Create Admin Account

If you didn't run the seed script:

1. Register at: `https://yourdomain.com/register`
2. Manually update user role in database:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
   ```

### Test Complete Flow

1. **As Customer:**
   - Browse products
   - Add to cart
   - Complete checkout (use real card or Stripe test mode)
   - Verify order confirmation email

2. **As Admin:**
   - Login to `/admin`
   - View dashboard statistics
   - Manage products
   - Process orders
   - Update fulfillment status

### Monitor for Errors

In Vercel Dashboard:
- Go to Deployments → Your deployment
- Click "View Function Logs"
- Monitor for any errors

## Step 9: Security Hardening

### Enable Production Best Practices

1. **Content Security Policy**: Already configured in Next.js
2. **HTTPS Only**: Automatically enforced by Vercel
3. **Rate Limiting**: Consider adding Vercel Rate Limiting
4. **Environment Variables**: Never commit `.env` to git

### Regular Maintenance

- [ ] Update dependencies monthly: `npm update`
- [ ] Monitor Stripe Dashboard for issues
- [ ] Check error logs weekly
- [ ] Backup database regularly
- [ ] Review and update SSL certificates (auto-renewed)

## Step 10: Going Live

### Final Pre-Launch Checklist

- [ ] All pages load correctly
- [ ] Products display properly
- [ ] Checkout completes successfully
- [ ] Emails are being sent
- [ ] Admin panel accessible
- [ ] Mobile responsive
- [ ] SEO meta tags present
- [ ] Analytics configured (add Google Analytics if needed)
- [ ] Privacy policy updated with real contact info
- [ ] Terms of service reviewed
- [ ] Shipping policy accurate
- [ ] Test orders processed and fulfilled

### Announcement

1. Update social media
2. Notify email list (if you have one)
3. Submit to search engines
4. Monitor initial traffic and orders

## Monitoring & Maintenance

### Analytics

Add analytics to track performance:

**Google Analytics:**
1. Get tracking ID from analytics.google.com
2. Add to `app/layout.tsx`:

```tsx
<Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
<Script id="google-analytics">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}');
  `}
</Script>
```

### Error Tracking

Consider adding:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay

### Performance Monitoring

- Use Vercel Analytics (built-in)
- Check Core Web Vitals in Google Search Console
- Monitor API response times

## Troubleshooting

### Database Connection Errors

```bash
# Test connection
npx prisma db pull

# Reset if needed (WARNING: deletes all data)
npx prisma migrate reset
```

### Environment Variable Issues

- Verify all required variables are set in Vercel
- Check for typos in variable names
- Ensure no extra spaces in values
- Redeploy after changes

### Stripe Webhook Failures

- Check webhook secret is correct
- Verify webhook URL is accessible
- Check Stripe Dashboard → Developers → Webhooks for errors
- Review function logs in Vercel

### Email Not Sending

- Verify Resend API key is correct
- Check domain verification status
- Review email from address
- Check spam folder

## Scaling Considerations

As your store grows:

1. **Database**: Upgrade Neon/Supabase plan for more connections
2. **Image Hosting**: Move to Cloudinary or S3
3. **Caching**: Implement Redis for sessions/cart
4. **CDN**: Already handled by Vercel
5. **Search**: Add Algolia for advanced product search

## Cost Estimates

**Free Tier (Starting Out):**
- Vercel: Free (Hobby plan)
- Neon: Free (0.5 GB storage)
- Resend: Free (3000 emails/month)
- Stripe: Pay-as-you-go (2.9% + $0.30 per transaction)
- Domain: ~$10-15/year

**Growing Business (~1000 orders/month):**
- Vercel Pro: $20/month
- Neon/Supabase: $10-20/month
- Resend: $20/month
- Stripe fees: ~$870 on $30,000 revenue
- Total: ~$50-60/month + Stripe fees

## Support Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Prisma Docs**: [prisma.io/docs](https://www.prisma.io/docs)
- **Stripe Docs**: [stripe.com/docs](https://stripe.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

## Backup Strategy

### Database Backups

**Neon**: Automatic backups included
**Supabase**: Daily backups on paid plans

**Manual Backup:**
```bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

### Code Backups

- Stored in GitHub (already backed up)
- Tag releases: `git tag v1.0.0 && git push --tags`

---

🎉 **Congratulations!** Your dropshipping store is now live!

Monitor your store, gather feedback, and iterate. Success! 🚀
