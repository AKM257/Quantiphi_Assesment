import { useEffect, useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import type { Category } from "shared-types";
import {
  useTransactionStore,
  selectCategoryTotals,
  selectTotalSavings,
  selectTotalSpent,
  selectTotalReceived,
} from "../store/transactionStore";
import { TransactionCard } from "./TransactionCard";
import { CategorySummary } from "./CategorySummary";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { Filters } from "./Filters";
import { CardSkeleton } from "./CardSkeleton";
import { MetricCard } from "./MetricCard";
import { Header } from "./Header";

type FilterValue = "all" | "credit" | "debit";

export function Dashboard() {
  const { transactions, isLoading, error, fetchTransactions, reassignCategory } =
    useTransactionStore();
  const [filter, setFilter] = useState<FilterValue>("all");

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filtered = useMemo(() => {
    if (filter === "all") return transactions;
    return transactions.filter((t) => t.direction === filter);
  }, [transactions, filter]);

  const categoryTotals = useMemo(() => selectCategoryTotals(transactions), [transactions]);
  const totalSavings = useMemo(() => selectTotalSavings(transactions), [transactions]);
  const totalSpent = useMemo(() => selectTotalSpent(transactions), [transactions]);
  const totalReceived = useMemo(() => selectTotalReceived(transactions), [transactions]);
  const netBalance = totalReceived - totalSpent;

  function handleCategoryChange(id: string, category: Category) {
    reassignCategory(id, category);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header netBalance={netBalance} />

      <main className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <Filters active={filter} onChange={setFilter} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(filter === "all" || filter === "debit") && (
              <MetricCard label="Total spent" value={totalSpent} tone="spent" icon="↓" />
            )}
            {(filter === "all" || filter === "credit") && (
              <MetricCard label="Total received" value={totalReceived} tone="received" icon="↑" />
            )}
            <MetricCard label="Expected savings" value={totalSavings} tone="savings" icon="●" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            ) : filtered.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No transactions to show.</p>
            ) : (
              <AnimatePresence>
                {filtered.map((tx) => (
                  <TransactionCard
                    key={tx.id}
                    transaction={tx}
                    onCategoryChange={handleCategoryChange}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-medium text-slate-800 mb-4">Spend by category</h2>
            <CategorySummary totals={categoryTotals} />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-medium text-slate-800 mb-2">Breakdown</h2>
            <AnalyticsCharts totals={categoryTotals} />
          </div>
        </aside>
      </main>
    </div>
  );
}
