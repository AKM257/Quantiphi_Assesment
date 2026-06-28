import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { Category } from "shared-types";

const COLORS: Record<Category, string> = {
  "Food & Dining": "#fbbf24",
  Travel: "#60a5fa",
  Salary: "#4ade80",
  Shopping: "#f472b6",
  Miscellaneous: "#94a3b8",
};

interface Props {
  totals: Record<string, number>;
}

export function AnalyticsCharts({ totals }: Props) {
  const data = Object.entries(totals).map(([name, value]) => ({ name, value }));

  if (data.length === 0) {
    return <p className="text-sm text-slate-500">No data to chart yet.</p>;
  }

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            isAnimationActive
            animationDuration={500}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name as Category] ?? "#94a3b8"} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Spent"]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
