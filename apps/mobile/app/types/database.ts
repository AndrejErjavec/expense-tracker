export type Expense = {
  id: number;
  user_id: string;
  amount: number;
  description: string | null;
  category_id: number;
  created_at: string;
  categories: Category | null;
};

export type Category = {
  id: number;
  name: string;
};
