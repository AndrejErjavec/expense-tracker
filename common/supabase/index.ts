import { createClient } from "@supabase/supabase-js";
import { Database, Tables } from "./database.types";

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL and Anon Key are missing. Set SUPABASE_URL/SUPABASE_ANON_KEY or EXPO_PUBLIC_SUPABASE_URL/EXPO_PUBLIC_SUPABASE_ANON_KEY.",
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type Transaction = Tables<"transaction">;
export type Category = Tables<"category">;

export type TransactionInsert = Database["public"]["Tables"]["transaction"]["Insert"];
export type TransactionUpdate = Database["public"]["Tables"]["transaction"]["Update"];

export const saveTransactionList = async (transactions: TransactionInsert[]) => {
  // BETTER APPROACH, BUT REQUIRES UNIQUE TRANSACTION CONSTRAINTS ON date, amount, referrent
  // const { error } = await supabase.from("transaction").upsert(transactions, {
  //   onConflict: "date, amount, referrent",
  //   ignoreDuplicates: true,
  // });

  // if (error) {
  //   console.error("Error saving transactions:", error);
  //   throw error;
  // }

  const { data: existingTransactions, error } = await supabase.from("transaction").select("*");

  const transactionsToInsert = transactions.filter(
    (tr) =>
      !existingTransactions?.some(
        (etr) => etr.date === tr.date && etr.amount == tr.amount && etr.referrent == tr.referrent,
      ),
  );

  if (transactionsToInsert.length == 0) {
    console.log("No transactions to insert - all existing");
    return;
  }

  const { error: error2 } = await supabase.from("transaction").insert(transactionsToInsert);

  if (error2) {
    console.log("Error in saving transactions", error2);
    throw error2;
  }
};
