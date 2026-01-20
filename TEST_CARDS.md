# Test Payment Credentials

## Quick Test Card Numbers (For Development/Testing)

Use these in **test mode** when your Stripe keys start with `pk_test_` and `sk_test_`:

### Successful Payments

| Card Brand | Card Number | CVC | Expiry | ZIP |
|------------|-------------|-----|--------|-----|
| Visa | `4242 4242 4242 4242` | Any 3 digits | Any future date | Any 5 digits |
| Mastercard | `5555 5555 5555 4444` | Any 3 digits | Any future date | Any 5 digits |
| Amex | `3782 822463 10005` | Any 4 digits | Any future date | Any 5 digits |
| Discover | `6011 1111 1111 1117` | Any 3 digits | Any future date | Any 5 digits |

### Failed Payments (for testing error handling)

| Scenario | Card Number |
|----------|-------------|
| Generic Decline | `4000 0000 0000 0002` |
| Insufficient Funds | `4000 0000 0000 9995` |
| Lost Card | `4000 0000 0000 9987` |
| Stolen Card | `4000 0000 0000 9979` |

### 3D Secure Testing

| Scenario | Card Number |
|----------|-------------|
| 3DS Required - Success | `4000 0027 6000 3184` |
| 3DS Required - Failure | `4000 0000 0000 0341` |

## Testing PayPal

1. **Enable PayPal in Stripe Dashboard**
   - Go to Settings → Payment methods
   - Enable PayPal

2. **PayPal Sandbox (Test Mode)**
   - Create test accounts at https://developer.paypal.com
   - Use PayPal sandbox credentials during test checkout

3. **Live Mode**
   - Connect your real PayPal business account in Stripe
   - Customers will use their actual PayPal accounts

## Important Notes

- ✅ Test cards work ONLY in test mode
- ✅ Use any future expiry date (e.g., 12/25, 03/27)
- ✅ Use any 3 or 4 digit CVC
- ✅ Use any valid ZIP code
- ❌ Never use real card numbers in test mode
- ❌ Test cards won't work in production (live mode)

## Switching to Real Payments

1. Get your **live** Stripe API keys (starts with `pk_live_` and `sk_live_`)
2. Update your `.env` file with live keys
3. Enable PayPal in Stripe Dashboard (live mode)
4. Deploy to production
5. Test with small real amounts first

See `PAYMENT_SETUP.md` for complete setup instructions.
