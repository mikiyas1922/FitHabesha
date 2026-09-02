# Backend Requirements for Payment Integration

## Overview
The frontend payment integration is complete and ready to use. However, the backend requires specific configuration for payment initiation to work properly.

## Current Status
- ✅ Frontend payment endpoints integrated (`POST /payments/init`, `GET /payments/verify/{orderId}`)
- ✅ PaymentInitiationModal component implemented
- ✅ PaymentVerification component implemented
- ✅ UUID validation added to prevent invalid tier IDs
- ✅ Error handling and user feedback in place
- ⚠️ **Backend requires membership tiers with valid UUIDs**

## Backend Requirements

### 1. Membership Tiers in Database
The backend must have membership tiers configured with valid UUIDs. The payment initiation endpoint validates that `membership_tier_id` exists in the database.

**Required fields per tier:**
- `id` (UUID) - e.g., `550e8400-e29b-41d4-a716-446655440001`
- `name` - e.g., "Basic", "Premium", "Elite"
- `price` - e.g., 1450, 2450, 4450
- `duration_months` - e.g., 1, 3, 6, 12
- `description` - Optional tier description

**Example database records:**
```sql
INSERT INTO membership_tiers (id, name, price, duration_months, description) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Basic', 1450, 1, 'Gym access (off-peak)'),
('550e8400-e29b-41d4-a716-446655440002', 'Standard', 2450, 1, 'Unlimited gym access'),
('550e8400-e29b-41d4-a716-446655440003', 'Premium', 4450, 1, 'All features + personal training'),
('550e8400-e29b-41d4-a716-446655440004', 'Elite', 7450, 1, 'Premium + 24/7 access');
```

### 2. Payment Gateway Configuration
The backend must be configured with StarPay credentials for payment initiation to work:
- StarPay API key
- Merchant ID
- Callback URLs for payment status updates

### 3. Frontend Tier Configuration (Temporary)
Until the backend provides a tiers endpoint, update the frontend mock tier IDs to match real database UUIDs:

**File:** `src/pages/member/MemberSubscriptions.jsx` and `src/pages/admin/AdminSubscriptions.jsx`

Replace mock IDs with real UUIDs:
```javascript
const membershipTiers = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001', // Replace with real UUID from database
    name: 'Basic',
    price: 'ETB 1,450/month',
    features: ['Gym access (off-peak)', 'Basic equipment'],
    popular: false,
    duration_months: 1,
  },
  // ... other tiers
]
```

### 4. Optional: Add Tiers Endpoint
To make the system more maintainable, consider adding a backend endpoint to fetch membership tiers:

```
GET /subscriptions/tiers
Response: {
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Basic",
      "price": 1450,
      "duration_months": 1,
      "description": "Gym access (off-peak)"
    }
  ]
}
```

If this endpoint is added, the frontend can be updated to fetch tiers dynamically instead of using hardcoded values.

## Testing Payment Flow

Once backend is configured:

1. **Member initiates payment:**
   - Member selects a membership tier
   - Frontend sends `POST /payments/init` with valid UUID
   - Backend creates pending subscription
   - Backend returns StarPay payment URL
   - User is redirected to complete payment

2. **Payment verification:**
   - Frontend polls `GET /payments/verify/{orderId}` using `billRefNo`
   - Backend checks payment status with StarPay
   - When status is `PAID`, subscription is activated

3. **Admin/Reception direct subscription:**
   - Uses `POST /subscriptions` to bypass payment
   - Sets subscription status to `active` immediately
   - For manual subscriptions or special cases

## Error Handling

The frontend now includes:
- UUID validation before API calls
- Clear error messages for invalid tier IDs
- Warning banners when mock tier IDs are detected
- Detailed console logging for debugging

## API Endpoints Summary

### Payment Endpoints
- `POST /payments/init` - Initiate payment (Member/Admin/Reception)
- `GET /payments/verify/{orderId}` - Verify payment status

### Subscription Endpoints
- `POST /subscriptions` - Create subscription (Admin/Reception only, bypasses payment)
- `PATCH /subscriptions/{id}/status` - Update subscription status (Admin/Reception only)
- `GET /subscriptions/active/{memberProfileId}` - Get active subscription
- `GET /subscriptions/member/{memberProfileId}` - Get all subscriptions for member

## Contact
For backend configuration assistance, contact your backend development team or system administrator.
