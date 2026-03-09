"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

const supabase = createClient();

type Part = {
  id: number;
  title: string;
  price: number;
  platform: string;
  category: string;
  trade_available: boolean;
  image_urls: string[] | null;
};

export default function PartsPage() {
