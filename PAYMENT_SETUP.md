# Payment Setup Guide - Stripe with PayPal & Cards

This guide will help you set up real payment processing with Stripe, supporting:
- **Credit/Debit Cards**: Visa, Mastercard, American Express, Discover, etc.
- **PayPal**: Full PayPal integration through Stripe

---

## 1. Create a Stripe Account

1. Go to https://stripe.com and sign up for an account
2. Complete the business verification process
3. Activate your account

---

## 2. Get Your Stripe API Keys

### Test Mode (for development)
1. Log in to your Stripe Dashboard
2. Click **Developers** in the left menu
3. Click **API keys**
4. You'll see:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Live Mode (for production)
1. Toggle the **Test mode** switch to OFF in your Stripe Dashboard
2. Complete your business profile and bank account setup
3. Get your live API keys:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)

---

## 3. Enable PayPal in Stripe

1. In your Stripe Dashboard, go to **Settings** → **Payment methods**
2. Find **PayPal** in the list
3. Click **Enable** or **Turn on**
4. Follow the prompts to connect your PayPal business account
5. If you don't have a PayPal business account, you'll need to create one first at https://www.paypal.com/business

**Note**: PayPal must be enabled in your Stripe account for it to work. Stripe handles the PayPal integration automatically.

---

## 4. Set Up Webhooks

Webhooks allow Stripe to notify your application about payment events.

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL:
   - For local testing: Use Stripe CLI (see below)
   - For production: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)

---

## 5. Update Your .env File

Replace the placeholder values in your `.env` file:

```env
# Stripe - Replace with your actual keys
STRIPE_PUBLIC_KEY="pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY"
STRIPE_SECRET_KEY="sk_test_YOUR_ACTUAL_SECRET_KEY"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_ACTUAL_WEBHOOK_SECRET"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

For production:
```env
STRIPE_PUBLIC_KEY="pk_live_YOUR_ACTUAL_PUBLISHABLE_KEY"
STRIPE_SECRET_KEY="sk_live_YOUR_ACTUAL_SECRET_KEY"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_ACTUAL_WEBHOOK_SECRET"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

---

## 6. Testing Payments Locally

### Option A: Use Stripe CLI (Recommended)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli#install
2. Log in:
   ```bash
   stripe login
   ```
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Use the webhook secret from the CLI output in your `.env` file

### Option B: Test Cards

Use these test card numbers in your checkout (test mode only):

| Card Type | Number | CVC | Expiry |
|-----------|--------|-----|--------|
| Visa | 4242 4242 4242 4242 | Any 3 digits | Any future date |
| Mastercard | 5555 5555 5555 4444 | Any 3 digits | Any future date |
| American Express | 3782 822463 10005 | Any 4 digits | Any future date |
| Discover | 6011 1111 1111 1117 | Any 3 digits | Any future date |
| Declined | 4000 0000 0000 0002 | Any 3 digits | Any future date |

### Testing PayPal

In test mode:
1. Use the PayPal sandbox at https://developer.paypal.com
2. Create test buyer and seller accounts
3. Use test credentials during checkout

---

## 7. Supported Card Brands

Stripe automatically supports all major card brands:

- ✅ **Visa**
- ✅ **Mastercard**
- ✅ **American Express**
- ✅ **Discover**
- ✅ **Diners Club**
- ✅ **JCB**
- ✅ **UnionPay**

No additional configuration needed - they're enabled by default!

---

## 8. Going Live

### Pre-launch Checklist:

1. ✅ Complete Stripe account verification
2. ✅ Enable PayPal in Stripe settings
3. ✅ Add bank account for payouts
4. ✅ Switch to live API keys in production `.env`
5. ✅ Set up production webhook endpoint
6. ✅ Test checkout flow with real payments (small amounts)
7. ✅ Set up proper error logging
8. ✅ Configure email notifications for orders

### Switch to Live Mode:

1. Update your `.env` with live keys (starts with `pk_live_` and `sk_live_`)
2. Update `NEXT_PUBLIC_APP_URL` to your production domain
3. Deploy your application
4. Test the checkout with a small real payment
5. Monitor your Stripe Dashboard for transactions

---

## 9. Security Best Practices

- ✅ Never commit your `.env` file to Git
- ✅ Use environment variables for all secrets
- ✅ Validate webhook signatures
- ✅ Use HTTPS in production
- ✅ Keep Stripe library updated
- ✅ Monitor for suspicious activity

---

## 10. Troubleshooting

### "Invalid API Key" Error
- Check that your API keys are correct
- Make sure you're using test keys in development
- Verify there are no spaces or quotes in your `.env` values

### PayPal Not Showing
- Ensure PayPal is enabled in your Stripe Dashboard
- Check that `payment_method_types` includes `'paypal'` in code
- Verify your Stripe account is eligible for PayPal

### Webhook Errors
- Verify webhook URL is publicly accessible
- Check webhook secret matches your Stripe Dashboard
- Use Stripe CLI for local testing

---

## Need Help?

- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- PayPal Integration: https://stripe.com/docs/payments/paypal

---

## Current Implementation

Your site now supports:
- ✅ **All major credit/debit cards** (Visa, Mastercard, Amex, Discover, etc.)
- ✅ **PayPal** payments
- ✅ Secure checkout with address collection
- ✅ Order confirmation page
- ✅ Webhook handling for payment events
- ✅ Automatic cart clearing after successful payment

Simply add your real Stripe API keys to start accepting payments!
