import { motion } from "framer-motion";
import type { Transaction, Category } from "shared-types";
import { CategoryDropdown } from "./CategoryDropdown";
import { SavingsBadge } from "./SavingsBadge";

interface Props {
  transaction: Transaction;
  onCategoryChange: (id: string, category: Category) => void;
}

export function TransactionCard({ transaction, onCategoryChange }: Props) {
  const isCredit = transaction.direction === "credit";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-800 truncate">
            {transaction.merchant ?? "Unknown merchant"}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{transaction.rawMessage}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span
            className={`font-semibold text-sm ${isCredit ? "text-green-600" : "text-slate-800"}`}
          >
            {isCredit ? "+" : "−"}₹{transaction.amount.toLocaleString("en-IN")}
          </span>
          <CategoryDropdown
            value={transaction.category}
            onChange={(category) => onCategoryChange(transaction.id, category)}
          />
        </div>
      </div>
      {transaction.cashback && <SavingsBadge cashback={transaction.cashback} />}
    </motion.div>
  );
}
