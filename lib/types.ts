// TypeScript interfaces for all data models

export type Profile = {
  id: string;
  username: string;
  email?: string;
  avatar_url?: string | null;
  bio?: string | null;
  location?: string | null;
  verified: boolean;
  seller_level?: string | null;
  created_at: string;
};

export type Part = {
  id: string;
  title: string;
  description?: string | null;
  price: number | null;
  condition?: string | null;
  category?: string | null;
  subcategory?: string | null;
  vehicle?: string | null;
  part_type?: string | null;
  location?: string | null;
  image_url?: string | null;
  images?: string[] | null;
  trade_available?: boolean;
  user_id: string;
  created_at: string;
};

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  part_id?: string | null;
  type?: string | null;
  read: boolean;
  created_at: string;
};

export type Conversation = {
  id: string;
  part_id: string;
  buyer_id: string;
  seller_id: string;
  last_message?: string | null;
  updated_at: string;
};

export type ConversationMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export type TradeRequest = {
  id: string;
  part_id: string;
  sender_id: string;
  receiver_id: string;
  message?: string | null;
  status: "pending" | "accepted" | "declined";
  created_at: string;
};

export type TradeMessage = {
  id: string;
  trade_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
};

export type Review = {
  id: string;
  part_id?: string | null;
  seller_id?: string | null;
  user_id?: string | null;
  buyer_id?: string | null;
  rating: number;
  comment?: string | null;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body?: string | null;
  link?: string | null;
  read: boolean;
  created_at: string;
};

export type AiScan = {
  id: string;
  user_id: string;
  image_url?: string | null;
  vehicle?: string | null;
  part?: string | null;
  condition?: string | null;
  confidence?: number | null;
  verified_boost?: boolean;
  created_at: string;
};

export type Report = {
  id: string;
  part_id: string;
  reporter_id: string;
  reason: string;
  created_at: string;
};

export type Purchase = {
  id: string;
  buyer_id: string;
  seller_id: string;
  part_id: string;
  created_at: string;
};
