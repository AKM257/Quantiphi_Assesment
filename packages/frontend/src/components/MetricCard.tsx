import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface Props {
  label: string;
  value: number;
  tone: "spent" | "received" | "savings";
  icon: string;
}

const TONE_STYLES: Record<Props["tone"], { bg: string; text: string; ring: string }> = {
  spent: { bg: "bg-rose-50", text: "text-rose-600", ring: "ring-rose-100" },
  received: { bg: "bg-green-50", text: "text-green-600", ring: "ring-green-100" },
  savings: { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-100" },
};

export function MetricCard({ label, value, tone, icon }: Props) {
  const spring = useSpring(0, { stiffness: 90, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString("en-IN"));
  const styles = TONE_STYLES[tone];

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border border-slate-200 p-4 ${styles.bg} ring-1 ${styles.ring}`}
    >
      <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1.5">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <p className={`text-2xl font-semibold ${styles.text}`}>
        ₹<motion.span>{display}</motion.span>
      </p>
    </motion.div>
  );
}
