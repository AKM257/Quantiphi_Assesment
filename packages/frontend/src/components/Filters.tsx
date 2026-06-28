type Filter = "all" | "credit" | "debit";

interface Props {
  active: Filter;
  onChange: (filter: Filter) => void;
}

const OPTIONS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "debit", label: "Outgoing" },
  { value: "credit", label: "Incoming" },
];

export function Filters({ active, onChange }: Props) {
  return (
    <div className="inline-flex bg-slate-100 rounded-full p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
            active === opt.value
              ? "bg-white shadow text-slate-900 font-medium"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
