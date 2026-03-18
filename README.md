# Any Part & Gear 🔧

A peer-to-peer marketplace for buying, selling, and trading car parts, boat parts, RC parts, work gear, and more.

## Features

- 🛒 **P2P Marketplace** — Browse, list, and trade parts without payment processing
- 🔍 **Smart Search & Filters** — Search by category, condition, price, and vehicle compatibility
- 💬 **Real-time Messaging** — Buyers and sellers communicate directly
- 🔄 **Trade Requests** — Propose trades between listings
- ⭐ **Trust & Ratings** — Verified sellers, trust scores, and review system
- 🏆 **Seller Leaderboard** — Top sellers ranked by trust score
- 🤖 **AI Vehicle Scan** — Identify vehicle parts with AI (OpenAI)
- 🔗 **APG X-Link** — Affiliate links to Amazon and eBay for parts comparison

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript** + **React 19**
- **Tailwind CSS**
- **Supabase** (Auth, Database, Storage)
- **OpenAI** (AI vehicle scan)

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/ajramosjr/any-part-and-gear.git
cd any-part-and-gear
npm install
```

### 2. Configure Environment Variables

Copy and edit the `.env.local` file with your actual credentials:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://your-project.supabase.co/storage/v1/object/public
OPENAI_API_KEY=sk-your-openai-key
```

Get your Supabase credentials from: **Dashboard → Project Settings → API**

### 3. Set up the Database

Run the migration SQL in your Supabase SQL Editor:

```
supabase/migrations/001_schema.sql
```

This creates all required tables, RLS policies, and triggers.

### 4. Create Storage Bucket

In Supabase Dashboard → **Storage** → Create a new bucket:
- **Name**: `part-images`
- **Public**: ✅ Yes

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — featured listings, categories, AI scan CTA |
| `/browse` | Browse all marketplace listings with search |
| `/category/[category]` | Browse by category (cars, boats, rc, etc.) |
| `/parts/[id]` | Listing detail with seller info & contact |
| `/sell` | Create a new listing |
| `/my-listings` | Manage your listings |
| `/seller/[id]` | Public seller profile with ratings |
| `/user/[id]` | User profile with listings |
| `/messages` | Conversations inbox |
| `/messages/[id]` | Real-time chat |
| `/inbox` | Message inbox |
| `/Trade` | Trade requests |
| `/leaderboard` | Top trusted sellers |
| `/reviews/submit` | Submit a review |
| `/ai-scan` | AI vehicle part scanner |
| `/apg-xlink` | Affiliate store links |
| `/notifications` | User notifications |
| `/settings` | Account settings |
| `/admin` | Admin dashboard |
| `/login` | Login |
| `/auth/signup` | Sign up |

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/listings` | GET, POST | List/create parts |
| `/api/listings/[id]` | GET, PUT, DELETE | Manage a listing |
| `/api/search` | GET | Full-text search with filters |
| `/api/messages/send` | POST | Send a message |
| `/api/trades` | GET, POST, PATCH | Trade requests |
| `/api/reviews` | POST | Submit a review |
| `/api/notifications` | GET, PATCH | Get/mark notifications |
| `/api/uploads` | POST | Upload image to storage |
| `/api/users/[id]` | GET | Public user profile |
| `/api/vehicle-scan` | POST | AI vehicle scan |
| `/api/ai/scan` | POST | AI scan with DB logging |
| `/auth/callback` | GET | OAuth callback |

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ajramosjr/any-part-and-gear)

Set the same environment variables in your Vercel project settings.
