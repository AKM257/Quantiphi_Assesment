import { motion } from "framer-motion";
import type { Category } from "shared-types";

const CATEGORY_BAR_COLORS: Record<Category, string> = {
  "Food & Dining": "bg-amber-400",
  Travel: "bg-blue-400",
  Salary: "bg-green-400",
  Shopping: "bg-pink-400",
  Miscellaneous: "bg-slate-400",
};

interface Props {
  totals: Record<string, number>;
}

export function CategorySummary({ totals }: Props) {
  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0) || 1;
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    return <p className="text-sm text-slate-500">No outgoing transactions yet.</p>;
  }

  return (
    <div className="space-y-3">
      {entries.map(([category, amount]) => {
        const pct = Math.round((amount / grandTotal) * 100);
        return (
          <div key={category}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-700">{category}</span>
              <span className="text-slate-500">
                ₹{amount.toLocaleString("en-IN")} · {pct}%
              </span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${CATEGORY_BAR_COLORS[category as Category] ?? "bg-slate-400"}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
