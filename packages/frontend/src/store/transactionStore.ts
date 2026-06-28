import { create } from "zustand";
import type { Transaction, Category } from "shared-types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  reassignCategory: (id: string, category: Category) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/transactions`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to fetch");
      set({ transactions: json.data, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  reassignCategory: async (id, category) => {
    const previous = get().transactions;
    // Optimistic update: UI reflects the change immediately, animates smoothly.
    set({
      transactions: previous.map((t) =>
        t.id === id ? { ...t, category, isManualOverride: true } : t
      ),
    });
    try {
      const res = await fetch(`${API_BASE}/transactions/${id}/category`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
    } catch (err) {
      // Roll back on failure.
      set({ transactions: previous, error: (err as Error).message });
    }
  },
}));

// ── Derived selectors ──────────────────────────────────────────────
// These never store a sum; they compute it fresh from the canonical
// array every time the store changes, so totals can never drift out
// of sync with the underlying transactions.

export function selectCategoryTotals(transactions: Transaction[]) {
  const totals: Record<string, number> = {};
  for (const tx of transactions) {
    if (tx.direction !== "debit") continue;
    totals[tx.category] = (totals[tx.category] || 0) + tx.amount;
  }
  return totals;
}

export function selectIncoming(transactions: Transaction[]) {
  return transactions.filter((t) => t.direction === "credit");
}

export function selectOutgoing(transactions: Transaction[]) {
  return transactions.filter((t) => t.direction === "debit");
}

export function selectTotalSavings(transactions: Transaction[]) {
  return transactions.reduce((sum, t) => sum + (t.cashback?.expectedSavings ?? 0), 0);
}

export function selectTotalSpent(transactions: Transaction[]) {
  return transactions
    .filter((t) => t.direction === "debit")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function selectTotalReceived(transactions: Transaction[]) {
  return transactions
    .filter((t) => t.direction === "credit")
    .reduce((sum, t) => sum + t.amount, 0);
}
