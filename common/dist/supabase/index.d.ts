import { Database, Tables } from "./database.types";
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<Database, "public", "public", {
    Tables: {
        category: {
            Row: {
                created_at: string;
                id: number;
                name: string | null;
            };
            Insert: {
                created_at?: string;
                id?: number;
                name?: string | null;
            };
            Update: {
                created_at?: string;
                id?: number;
                name?: string | null;
            };
            Relationships: [];
        };
        transaction: {
            Row: {
                amount: number;
                category_id: number | null;
                created_at: string;
                currency: string;
                date: string;
                description: string | null;
                id: number;
                referrent: string;
                type: string;
                user_id: string;
            };
            Insert: {
                amount: number;
                category_id?: number | null;
                created_at?: string;
                currency: string;
                date: string;
                description?: string | null;
                id?: number;
                referrent: string;
                type: string;
                user_id: string;
            };
            Update: {
                amount?: number;
                category_id?: number | null;
                created_at?: string;
                currency?: string;
                date?: string;
                description?: string | null;
                id?: number;
                referrent?: string;
                type?: string;
                user_id?: string;
            };
            Relationships: [{
                foreignKeyName: "transaction_category_id_fkey";
                columns: ["category_id"];
                isOneToOne: false;
                referencedRelation: "category";
                referencedColumns: ["id"];
            }];
        };
    };
    Views: { [_ in never]: never; };
    Functions: { [_ in never]: never; };
    Enums: { [_ in never]: never; };
    CompositeTypes: { [_ in never]: never; };
}, {
    PostgrestVersion: "13.0.5";
}>;
export type Transaction = Tables<"transaction">;
export type Category = Tables<"category">;
export type TransactionInsert = Database["public"]["Tables"]["transaction"]["Insert"];
export type TransactionUpdate = Database["public"]["Tables"]["transaction"]["Update"];
export declare const saveTransactionList: (transactions: TransactionInsert[]) => Promise<void>;
//# sourceMappingURL=index.d.ts.map