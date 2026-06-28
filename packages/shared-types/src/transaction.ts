// The fixed set of categories the system understands.
// A union type (not `string`) means the compiler rejects typos like
// "Food And Dining" at every call site, in both packages.
export type Category =
  | "Food & Dining"
  | "Travel"
  | "Salary"
  | "Shopping"
  | "Miscellaneous";

export type Direction = "credit" | "debit";

// A transaction that successfully made it through the full pipeline:
// parsed, categorized, and checked for cashback eligibility.
export interface Transaction {
  id: string;
  rawMessage: string;
  amount: number;
  direction: Direction;
  merchant: string | null; // null when parser found an amount but no merchant
  category: Category;
  isManualOverride: boolean; // true once the user changes the category via dropdown
  cashback: CashbackInfo | null;
}

export interface CashbackInfo {
  expectedSavings: number;
  ratePercent: number;
  reason: "keyword" | "reward-partner";
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
