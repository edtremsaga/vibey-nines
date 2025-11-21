# SeatGeek API Integration Guide

## Overview

SeatGeek provides a public API that allows developers to access event data, performer information, venue details, and ticket pricing information. This guide outlines how to integrate SeatGeek's API into the vibey-nines application.

## Getting Started

### 1. Register for API Access

1. Visit [SeatGeek Developer Portal](https://developer.seatgeek.com/login)
2. Sign up for an account
3. Register your application
4. You'll receive:
   - `client_id` - Public identifier for your app
   - `client_secret` - Secret key for authentication (keep secure!)

### 2. API Base URL

```
https://api.seatgeek.com/2/
```

## Authentication

SeatGeek supports two authentication methods:

### Method 1: Query Parameters (Simpler)
Append `client_id` and `client_secret` as query parameters:
```
https://api.seatgeek.com/2/events?client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET
```

### Method 2: HTTP Basic Authentication
Encode credentials in base64 and include in Authorization header:
```
Authorization: Basic base64(client_id:client_secret)
```

**⚠️ Security Note**: Never expose `client_secret` in frontend code. Always make API calls from your backend/API routes.

## Available Endpoints

### Events
- **Endpoint**: `/2/events`
- **Purpose**: Search and retrieve event listings
- **Example Query Parameters**:
  - `q`: Search query (e.g., "Taylor Swift")
  - `venue.city`: Filter by city
  - `datetime_utc.gte`: Events on or after this date
  - `per_page`: Results per page (default: 10, max: 500)
  - `page`: Page number

### Performers
- **Endpoint**: `/2/performers`
- **Purpose**: Get information about artists, bands, or teams

### Venues
- **Endpoint**: `/2/venues`
- **Purpose**: Get venue information

### Recommendations
- **Endpoint**: `/2/recommendations`
- **Purpose**: Get event recommendations

## Example API Response Structure

```json
{
  "events": [
    {
      "id": 123456,
      "title": "Taylor Swift: The Eras Tour",
      "datetime_local": "2024-10-15T20:00:00",
      "datetime_utc": "2024-10-16T03:00:00Z",
      "venue": {
        "name": "SoFi Stadium",
        "city": "Inglewood",
        "state": "CA",
        "address": "1001 Stadium Drive"
      },
      "performers": [
        {
          "name": "Taylor Swift",
          "image": "https://..."
        }
      ],
      "stats": {
        "average_price": 450.00,
        "lowest_price": 250.00,
        "highest_price": 1200.00
      },
      "url": "https://seatgeek.com/..."
    }
  ],
  "meta": {
    "total": 50,
    "per_page": 10,
    "page": 1
  }
}
```

## Important Limitations

⚠️ **Critical for Price Watching**:
- The API provides **aggregate pricing statistics** (average, lowest, highest prices)
- It may **NOT provide individual ticket listings** or real-time per-ticket prices
- For detailed ticket-level pricing, you may need:
  - Partner program access
  - Additional permissions
  - Alternative data sources

This is important for vibey-nines if you need to track specific ticket prices rather than aggregate statistics.

## Rate Limits

- Check SeatGeek's API documentation for current rate limits
- Implement proper error handling and rate limit management
- Consider caching responses to minimize API calls

## Implementation Approach for vibey-nines

### Recommended Architecture

1. **Backend API Routes** (Next.js API routes or separate Node.js server):
   - Store `client_id` and `client_secret` in environment variables
   - Create API endpoints that proxy requests to SeatGeek
   - Handle authentication securely
   - Implement caching and rate limiting

2. **Frontend (React)**:
   - Make requests to your own backend API routes
   - Never expose SeatGeek credentials to the client
   - Display event data and pricing information

### Example Implementation

#### Backend API Route (`app/api/seatgeek/events/route.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server';

const SEATGEEK_BASE_URL = 'https://api.seatgeek.com/2';
const CLIENT_ID = process.env.SEATGEEK_CLIENT_ID;
const CLIENT_SECRET = process.env.SEATGEEK_CLIENT_SECRET;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const city = searchParams.get('city');
  const date = searchParams.get('date');

  try {
    const params = new URLSearchParams({
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
    });

    if (query) params.append('q', query);
    if (city) params.append('venue.city', city);
    if (date) params.append('datetime_utc.gte', date);

    const response = await fetch(`${SEATGEEK_BASE_URL}/events?${params}`);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
```

#### Frontend Component:

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function EventSearch() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchEvents = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/seatgeek/events?q=${query}`);
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
}
```

## Environment Variables

Create a `.env.local` file:

```env
SEATGEEK_CLIENT_ID=your_client_id_here
SEATGEEK_CLIENT_SECRET=your_client_secret_here
```

## Next Steps

1. ✅ Register for SeatGeek API access
2. ✅ Set up environment variables
3. ✅ Create backend API routes for SeatGeek integration
4. ✅ Implement frontend components to display event data
5. ⚠️ **Verify pricing data availability** - Test if the API provides the level of pricing detail needed for price watching
6. Consider joining SeatGeek Partner Program if you plan to monetize

## Resources

- [SeatGeek Developer Portal](https://developer.seatgeek.com/)
- [SeatGeek API Documentation](https://platform.seatgeek.com/)
- [API Terms of Use](https://seatgeek.com/api-terms)
- [Partner Program](https://seatgeek.com/build)

## Questions to Resolve

1. **Pricing Granularity**: Does the API provide per-ticket pricing or only aggregate statistics?
2. **Real-time Updates**: How frequently does pricing data update?
3. **Rate Limits**: What are the specific rate limits for the free tier?
4. **Partner Program**: What additional data/features are available through the partner program?

