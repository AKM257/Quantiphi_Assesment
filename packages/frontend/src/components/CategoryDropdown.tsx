import type { Category } from "shared-types";

const CATEGORIES: Category[] = [
  "Food & Dining",
  "Travel",
  "Salary",
  "Shopping",
  "Miscellaneous",
];

const CATEGORY_COLORS: Record<Category, string> = {
  "Food & Dining": "bg-amber-100 text-amber-800 border-amber-300",
  Travel: "bg-blue-100 text-blue-800 border-blue-300",
  Salary: "bg-green-100 text-green-800 border-green-300",
  Shopping: "bg-pink-100 text-pink-800 border-pink-300",
  Miscellaneous: "bg-slate-100 text-slate-700 border-slate-300",
};

interface Props {
  value: Category;
  onChange: (category: Category) => void;
}

export function CategoryDropdown({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Category)}
      aria-label="Transaction category"
      className={`text-xs font-medium rounded-full px-3 py-1 border cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400
        ${CATEGORY_COLORS[value]}`}
    >
      {CATEGORIES.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}
