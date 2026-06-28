import type { Transaction, Category } from "shared-types";
import { ITransactionRepository } from "./ITransactionRepository";

export class InMemoryTransactionRepository implements ITransactionRepository {
  private transactions: Transaction[] = [];

  getAll(): Transaction[] {
    return this.transactions;
  }

  seed(transactions: Transaction[]): void {
    this.transactions = transactions;
  }

  updateCategory(id: string, category: Category): Transaction | null {
    const tx = this.transactions.find((t) => t.id === id);
    if (!tx) return null;
    tx.category = category;
    tx.isManualOverride = true;
    return tx;
  }
}
