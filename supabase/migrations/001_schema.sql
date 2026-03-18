-- ============================================================
-- Any Part & Gear — Complete Database Schema
-- Run this in the Supabase SQL Editor or via supabase db push
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE NOT NULL,
  email         TEXT,
  avatar_url    TEXT,
  bio           TEXT,
  location      TEXT,
  verified      BOOLEAN DEFAULT FALSE,
  seller_level  TEXT DEFAULT 'new',   -- new | bronze | silver | gold
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- PARTS / LISTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS parts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  price           NUMERIC(10, 2),
  condition       TEXT CHECK (condition IN ('new', 'like-new', 'used', 'for-parts')),
  category        TEXT,                        -- cars | boats | marine | tools | machinery | rc | rv | buses
  subcategory     TEXT,
  vehicle         TEXT,                        -- compatibility, e.g. "2018 Ford F-150"
  part_type       TEXT,
  location        TEXT,
  image_url       TEXT,
  images          TEXT[],
  trade_available BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONVERSATIONS (for buyer <-> seller messaging)
-- ============================================================
CREATE TABLE IF NOT EXISTS conversations (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id      UUID REFERENCES parts(id) ON DELETE SET NULL,
  buyer_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message TEXT,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MESSAGES (within a conversation)
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  body            TEXT,
  content         TEXT,                         -- alias used by some routes
  part_id         UUID REFERENCES parts(id) ON DELETE SET NULL,
  type            TEXT DEFAULT 'message',       -- message | review_request
  read            BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRADE REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS trade_requests (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id     UUID NOT NULL REFERENCES parts(id) ON DELETE CASCADE,
  sender_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message     TEXT,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Alias used by Trade/page.tsx
CREATE TABLE IF NOT EXISTS trades (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id     UUID REFERENCES parts(id) ON DELETE CASCADE,
  seller_id   UUID REFERENCES profiles(id) ON DELETE CASCADE,
  buyer_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message     TEXT,
  status      TEXT DEFAULT 'pending',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRADE MESSAGES (chat within a trade)
-- ============================================================
CREATE TABLE IF NOT EXISTS trade_messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trade_id    UUID NOT NULL REFERENCES trade_requests(id) ON DELETE CASCADE,
  sender_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message     TEXT,                             -- used by useTradeChat hook
  content     TEXT,                             -- used by sendTradeMessage
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- REVIEWS (for parts and sellers)
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id     UUID REFERENCES parts(id) ON DELETE CASCADE,
  seller_id   UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  buyer_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (part_id, user_id)
);

-- ============================================================
-- SELLER REVIEWS (dedicated seller ratings)
-- ============================================================
CREATE TABLE IF NOT EXISTS seller_reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  buyer_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  part_id     UUID REFERENCES parts(id) ON DELETE SET NULL,
  rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (seller_id, reviewer_id, part_id)
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT,
  link       TEXT,
  read       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PURCHASES (order history — no payments, just tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS purchases (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  part_id    UUID NOT NULL REFERENCES parts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alias used by some queries
CREATE TABLE IF NOT EXISTS orders (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  part_id    UUID NOT NULL REFERENCES parts(id) ON DELETE CASCADE,
  status     TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AI SCANS
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_scans (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  image_url      TEXT,
  vehicle        TEXT,
  part           TEXT,
  condition      TEXT,
  confidence     NUMERIC(4, 3),
  verified_boost BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- REPORTS (moderation)
-- ============================================================
CREATE TABLE IF NOT EXISTS reports (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id     UUID NOT NULL REFERENCES parts(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason      TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Legacy ratings table (used by user/[id]/page.tsx)
CREATE TABLE IF NOT EXISTS ratings (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  buyer_id  UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating    INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades         ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews        ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications  ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases      ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_scans       ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports        ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings        ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, owner write
CREATE POLICY "Public read profiles"    ON profiles FOR SELECT USING (true);
CREATE POLICY "Owner update profile"    ON profiles FOR UPDATE USING (auth.uid() = id);

-- Parts: public read, owner write
CREATE POLICY "Public read parts"       ON parts FOR SELECT USING (true);
CREATE POLICY "Auth users insert parts" ON parts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update parts"      ON parts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete parts"      ON parts FOR DELETE USING (auth.uid() = user_id);

-- Conversations: parties only
CREATE POLICY "Conversation parties"    ON conversations FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Create conversation"     ON conversations FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Messages: participants only
CREATE POLICY "Message participants"    ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Send message"            ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Trade requests
CREATE POLICY "Trade request parties"   ON trade_requests FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Create trade request"    ON trade_requests FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Trade messages
CREATE POLICY "Trade message parties"   ON trade_messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Send trade message"      ON trade_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Reviews: public read, authenticated write
CREATE POLICY "Public read reviews"     ON reviews FOR SELECT USING (true);
CREATE POLICY "Auth users insert review" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Seller reviews
CREATE POLICY "Public read seller reviews" ON seller_reviews FOR SELECT USING (true);
CREATE POLICY "Auth insert seller review"  ON seller_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Notifications: owner only
CREATE POLICY "Owner notifications"     ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insert notification"     ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Mark notification read"  ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Purchases
CREATE POLICY "Purchases parties"       ON purchases FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- AI scans: owner only
CREATE POLICY "Owner ai scans"          ON ai_scans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insert ai scan"          ON ai_scans FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reports: authenticated write, admin read
CREATE POLICY "Auth insert report"      ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Ratings: public read
CREATE POLICY "Public read ratings"     ON ratings FOR SELECT USING (true);
CREATE POLICY "Auth insert rating"      ON ratings FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
-- Run in Supabase Dashboard > Storage > New Bucket: "part-images" (public)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('part-images', 'part-images', true);
