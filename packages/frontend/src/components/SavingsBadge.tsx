import { motion } from "framer-motion";
import type { CashbackInfo } from "shared-types";

export function SavingsBadge({ cashback }: { cashback: CashbackInfo }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="mt-2 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2"
    >
      <span className="text-green-600 text-sm">●</span>
      <span className="text-sm text-green-800">
        Expected Savings: <span className="font-semibold">₹{cashback.expectedSavings}</span>
        <span className="text-green-600 text-xs ml-1">({cashback.ratePercent}% cashback)</span>
      </span>
    </motion.div>
  );
}
