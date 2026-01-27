import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database, Tables } from "./database.types";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

let supabase: SupabaseClient | null = null;

export const initSupabase = (config: SupabaseConfig) => {
  if (!supabase) {
    supabase = createClient<Database>(config.url, config.anonKey);
  }
  return supabase;
};

export const getSupabase = () => {
  if (!supabase) {
    throw new Error("Call initSupabase first!");
  }
  return supabase;
};

export type Transaction = Tables<"transaction">;
export type Category = Tables<"category">;

export type TransactionInsert = Database["public"]["Tables"]["transaction"]["Insert"];
export type TransactionUpdate = Database["public"]["Tables"]["transaction"]["Update"];

export const saveTransactionList = async (transactions: TransactionInsert[]) => {
  const supabase = getSupabase();
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
