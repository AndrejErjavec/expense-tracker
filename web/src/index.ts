import { initSupabase } from "@expense-tracker/common/supabase";
import app from "./app";
import dotenv from "dotenv";

dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw Error("Supabase url and annon key must be defined");
}
initSupabase({ url: supabaseUrl, anonKey: supabaseAnonKey });

const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
