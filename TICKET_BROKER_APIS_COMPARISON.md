# Ticket Broker APIs Comparison

## Overview

This document compares API access options from three major ticket brokers: SeatGeek, StubHub, and Ticketmaster, to help determine the best approach for vibey-nines.

---

## SeatGeek API

### ✅ Access Level
- **Public API** - Available to all developers
- Registration required at [developer.seatgeek.com](https://developer.seatgeek.com/)

### Authentication
- `client_id` and `client_secret` required
- Query parameters or HTTP Basic Auth

### Available Data
- Event listings
- Performer information
- Venue details
- **Aggregate pricing statistics** (average, lowest, highest prices)
- ⚠️ **May NOT provide individual ticket listings or real-time per-ticket prices**

### Pricing Data Limitations
- Provides aggregate statistics only
- Individual ticket-level pricing may require partner program access

### Getting Started
1. Register at [developer.seatgeek.com](https://developer.seatgeek.com/login)
2. Get `client_id` and `client_secret`
3. Start making API calls immediately

---

## StubHub API

### ⚠️ Access Level
- **Official API exists** but access may be **restricted**
- Requires developer account registration
- May require affiliate/partner status for full access

### Authentication
- **OAuth2** authentication required
- All requests must be over HTTPS
- Access token needed for authenticated requests

### Available Data
- Event search
- Event details
- Ticket purchasing (if authorized)
- Ticket listing (if authorized)
- ⚠️ **Limited ticket information for affiliates** - may only access categories, events, and venues with minimal ticket data

### Pricing Data Limitations
- Full pricing data may require affiliate/partner relationship
- Affiliates may have limited access to ticket information
- Real-time pricing may not be available to all developers

### Getting Started
1. Register at [developer.stubhub.com](https://developer.stubhub.com/)
2. Create application and obtain access keys
3. Implement OAuth2 authentication
4. ⚠️ May need to apply for affiliate/partner status for full access

### Documentation
- [StubHub Developer Portal](https://developer.stubhub.com/docs/overview/introduction/)

---

## Ticketmaster API

### ✅ Access Level (Discovery API)
- **Open API** - Available to all developers
- Registration required at [developer.ticketmaster.com](https://developer.ticketmaster.com/)

### Authentication
- API key required
- Simple key-based authentication

### Available APIs

#### 1. Discovery API (Open Access)
- ✅ **Publicly available** - Register and start using immediately
- Event search
- Venue information
- Attraction details
- ⚠️ **May have limited pricing data** - primarily for event discovery

#### 2. Partner API (Restricted)
- ❌ **Requires official distribution relationship** with Ticketmaster
- Ticket reservation and purchasing
- Full ticket and event information
- Real-time inventory data

#### 3. Inventory Status API (Restricted)
- ❌ **Authorized clients only** - Must contact Ticketmaster
- Real-time event inventory status updates

### Pricing Data Limitations
- Discovery API: Limited pricing information (primarily for discovery)
- Partner API: Full pricing data (requires business relationship)
- Inventory Status API: Real-time inventory (requires authorization)

### Getting Started
1. Register at [Ticketmaster Developer Portal](https://developer.ticketmaster.com/)
2. Create application and obtain API key
3. Start using Discovery API immediately
4. For Partner/Inventory APIs: Contact Ticketmaster for business relationship

### Documentation
- [Ticketmaster Developer Portal](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/)

---

## Comparison Summary

| Feature | SeatGeek | StubHub | Ticketmaster (Discovery) |
|---------|----------|---------|-------------------------|
| **Public Access** | ✅ Yes | ⚠️ Limited | ✅ Yes |
| **Registration** | Required | Required | Required |
| **Authentication** | client_id/secret | OAuth2 | API Key |
| **Event Search** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Pricing Data** | ⚠️ Aggregate only | ⚠️ Limited/Partner | ⚠️ Limited |
| **Real-time Prices** | ❓ Unclear | ❓ Partner only | ❌ No (Discovery) |
| **Ease of Setup** | ⭐⭐⭐ Easy | ⭐⭐ Moderate | ⭐⭐⭐ Easy |
| **Partner Required** | ❌ No | ⚠️ Maybe | ❌ No (Discovery) |

---

## Recommendations for vibey-nines

### Option 1: Start with SeatGeek + Ticketmaster Discovery
- **Pros**: 
  - Both have public APIs
  - Easy to get started
  - Good for event discovery
- **Cons**:
  - Pricing data may be limited/aggregate
  - May not have real-time per-ticket pricing

### Option 2: Apply for Partner Programs
- **StubHub**: Apply for affiliate/partner status
- **Ticketmaster**: Establish business relationship for Partner API
- **Pros**: 
  - Access to detailed pricing data
  - Real-time inventory information
- **Cons**:
  - Requires business relationship
  - May have revenue sharing requirements
  - Longer approval process

### Option 3: Hybrid Approach
1. **Phase 1**: Use SeatGeek + Ticketmaster Discovery for MVP
   - Event discovery
   - Aggregate pricing
   - Basic price watching
2. **Phase 2**: Apply for partner programs for detailed pricing
   - Real-time ticket-level pricing
   - Enhanced price tracking

---

## Next Steps

1. ✅ **Test SeatGeek API** - Register and test pricing data availability
2. ✅ **Test Ticketmaster Discovery API** - Register and see what pricing data is available
3. ⚠️ **Evaluate StubHub** - Determine if affiliate/partner status is needed
4. 📊 **Compare Pricing Data** - Test all three APIs to see which provides the best pricing granularity
5. 🤝 **Consider Partner Programs** - If detailed pricing is needed, start partner program applications early

---

## Important Questions to Answer

1. **What level of pricing detail is needed?**
   - Aggregate statistics (average/lowest/highest)?
   - Per-ticket pricing?
   - Real-time updates?

2. **What's the use case?**
   - Event discovery only?
   - Price watching/alerting?
   - Ticket purchasing integration?

3. **What's the timeline?**
   - Need to launch quickly? → Use public APIs
   - Can wait for approvals? → Apply for partner programs

4. **Business model?**
   - Free service? → Public APIs
   - Revenue sharing? → Partner programs may be viable

---

## Resources

### SeatGeek
- [Developer Portal](https://developer.seatgeek.com/)
- [API Documentation](https://platform.seatgeek.com/)
- [Partner Program](https://seatgeek.com/build)

### StubHub
- [Developer Portal](https://developer.stubhub.com/)
- [API Documentation](https://developer.stubhub.com/docs/overview/introduction/)

### Ticketmaster
- [Developer Portal](https://developer.ticketmaster.com/)
- [Discovery API](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/)
- [Partner API](https://developer.ticketmaster.com/products-and-docs/apis/partner/)

