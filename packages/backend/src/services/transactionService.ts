import type { Transaction, Category } from "shared-types";
import { parseMessage } from "../parser/parseMessage";
import { categorize } from "../categorization/categoryEngine";
import { detectCashback } from "../rewards/cashbackEngine";
import { ITransactionRepository } from "../repository/ITransactionRepository";

let nextId = 1;

export class TransactionService {
  constructor(private repo: ITransactionRepository) {}

  ingestMessages(rawMessages: string[]): Transaction[] {
    const transactions: Transaction[] = [];

    for (const message of rawMessages) {
      const parsed = parseMessage(message);
      if (!parsed) {
        // Total parse failure: log and drop.
        console.warn(`[parser] dropped unparseable message: "${message}"`);
        continue;
      }

      const category = categorize(parsed);
      const cashback = detectCashback(parsed);

      transactions.push({
        id: String(nextId++),
        rawMessage: parsed.rawMessage,
        amount: parsed.amount,
        direction: parsed.direction,
        merchant: parsed.merchant,
        category,
        isManualOverride: false,
        cashback,
      });
    }

    this.repo.seed(transactions);
    return transactions;
  }

  getAll(): Transaction[] {
    return this.repo.getAll();
  }

  reassignCategory(id: string, category: Category): Transaction | null {
    return this.repo.updateCategory(id, category);
  }
}
