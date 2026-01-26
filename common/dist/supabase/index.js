"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveTransactionList = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key are missing. Set SUPABASE_URL/SUPABASE_ANON_KEY or EXPO_PUBLIC_SUPABASE_URL/EXPO_PUBLIC_SUPABASE_ANON_KEY.");
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
const saveTransactionList = async (transactions) => {
    // BETTER APPROACH, BUT REQUIRES UNIQUE TRANSACTION CONSTRAINTS ON date, amount, referrent
    // const { error } = await supabase.from("transaction").upsert(transactions, {
    //   onConflict: "date, amount, referrent",
    //   ignoreDuplicates: true,
    // });
    // if (error) {
    //   console.error("Error saving transactions:", error);
    //   throw error;
    // }
    const { data: existingTransactions, error } = await exports.supabase.from("transaction").select("*");
    const transactionsToInsert = transactions.filter((tr) => !existingTransactions?.some((etr) => etr.date === tr.date && etr.amount == tr.amount && etr.referrent == tr.referrent));
    if (transactionsToInsert.length == 0) {
        console.log("No transactions to insert - all existing");
        return;
    }
    const { error: error2 } = await exports.supabase.from("transaction").insert(transactionsToInsert);
    if (error2) {
        console.log("Error in saving transactions", error2);
        throw error2;
    }
};
exports.saveTransactionList = saveTransactionList;
//# sourceMappingURL=index.js.map