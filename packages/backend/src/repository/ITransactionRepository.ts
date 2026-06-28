import type { Transaction, Category } from "shared-types";

export interface ITransactionRepository {
  getAll(): Transaction[];
  seed(transactions: Transaction[]): void;
  updateCategory(id: string, category: Category): Transaction | null;
}
