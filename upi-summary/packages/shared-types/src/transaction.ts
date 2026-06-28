export type Category = "Food & Dining" | "Travel" | "Salary" | "Shopping" | "Miscellaneous";
export type Direction = "credit" | "debit";
export interface Transaction {
  id: string; rawMessage: string; amount: number; direction: Direction;
  merchant: string | null; category: Category; isManualOverride: boolean;
  cashback: CashbackInfo | null;
}
export interface CashbackInfo { expectedSavings: number; ratePercent: number; reason: "keyword" | "reward-partner"; }
export interface ApiResponse<T> { success: boolean; data?: T; error?: string; }
