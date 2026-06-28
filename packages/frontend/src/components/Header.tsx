import { motion } from "framer-motion";

interface Props {
  netBalance: number;
}

export function Header({ netBalance }: Props) {
  const isPositive = netBalance >= 0;

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-8">
      <motion.div
        aria-hidden
        className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/10"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-16 left-1/3 w-72 h-72 rounded-full bg-white/5"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative max-w-5xl mx-auto flex items-end justify-between flex-wrap gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-semibold text-white tracking-tight"
          >
            Transaction Summary
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-sm text-indigo-100 mt-1"
          >
            UPI activity, auto-categorized, with expected cashback savings
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20"
        >
          <p className="text-xs text-indigo-100">Net balance</p>
          <p className={`text-lg font-semibold ${isPositive ? "text-white" : "text-rose-200"}`}>
            {isPositive ? "+" : "−"}₹{Math.abs(netBalance).toLocaleString("en-IN")}
          </p>
        </motion.div>
      </div>
    </header>
  );
}
