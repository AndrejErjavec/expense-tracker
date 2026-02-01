import { useEffect, useState } from "react";
import { getTransactions, type Transaction } from "@expense-tracker/common/supabase";

function App() {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const t = await getTransactions();
        setTransactions(t);
      } catch (e) {
        console.log("error fetching", e);
      }
    };

    fetchTransactions();
  }, []);

  if (!transactions) {
    return (
      <div className="min-h-screen px-6 py-12">
        <div className="mx-auto max-w-6xl text-sm font-medium tracking-wide text-stone-600">
          Loading transactions…
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="min-h-screen px-6 py-12">
        <div className="mx-auto max-w-6xl text-sm font-medium tracking-wide text-stone-600">
          No transactions
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Expense Tracker</p>
          <h1 className="mt-3 font-serif text-4xl text-stone-900">Transactions</h1>
          <p className="mt-2 max-w-2xl text-sm text-stone-600">
            A clean ledger view of your latest transactions, ready for review and export.
          </p>
        </header>
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-[#fffaf1] shadow-[0_14px_30px_rgba(28,26,22,0.14)]">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-gradient-to-b from-[#fffefb] to-[#f6efe2]">
              <tr className="text-xs uppercase tracking-[0.2em] text-stone-500">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold">Referrent</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Currency</th>
                <th className="px-4 py-3 font-semibold">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {transactions.map((tr, index) => (
                <tr
                  key={tr.id}
                  className={
                    index % 2 === 0
                      ? "bg-[#fffaf1] transition-colors hover:bg-[#f3efe6]"
                      : "bg-[#fdf7ed] transition-colors hover:bg-[#f3efe6]"
                  }
                >
                  <td className="whitespace-nowrap px-4 py-4">{tr.date}</td>
                  <td className="px-4 py-4">{tr.description ?? "—"}</td>
                  <td className="px-4 py-4">{tr.referrent}</td>
                  <td className="px-4 py-4">{tr.type}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-emerald-700">
                    {tr.amount}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">{tr.currency}</td>
                  <td className="whitespace-nowrap px-4 py-4">{tr.category_id ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
