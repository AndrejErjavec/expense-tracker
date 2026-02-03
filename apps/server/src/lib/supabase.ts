import { Database } from "@expense-tracker/api";
import { createClient } from "@supabase/supabase-js";

import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw Error("Supabase url and annon key must be defined");
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
