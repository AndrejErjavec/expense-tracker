import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Tables } from "./supabase.types";

export type Transaction = Tables<"transaction">;
export type Category = Tables<"category">;

export type TransactionInsert = Database["public"]["Tables"]["transaction"]["Insert"];
export type TransactionUpdate = Database["public"]["Tables"]["transaction"]["Update"];

export const saveTransactionList = async (supabase: SupabaseClient<Database>, transactions: TransactionInsert[]) => {
  // BETTER APPROACH, BUT REQUIRES UNIQUE TRANSACTION CONSTRAINTS ON date, amount, referrent, account
  // const { error } = await supabase.from("transaction").upsert(transactions, {
  //   onConflict: "date, amount, referrent, account",
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
        (etr) =>
          etr.date === tr.date && etr.amount == tr.amount && etr.referrent == tr.referrent && etr.account == tr.account,
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

export const getTransactions = async (supabase: SupabaseClient<Database>): Promise<Transaction[]> => {
  const { data: transactions, error } = await supabase.from("transaction").select("*");

  if (error) throw Error;
  return transactions;
};
