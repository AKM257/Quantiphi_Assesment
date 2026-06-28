import { Request, Response } from "express";
import type { ApiResponse, Transaction, Category } from "shared-types";
import { TransactionService } from "../services/transactionService";
import { mockMessages } from "../data/mockMessages";

const VALID_CATEGORIES: Category[] = [
  "Food & Dining",
  "Travel",
  "Salary",
  "Shopping",
  "Miscellaneous",
];

export function createTransactionController(service: TransactionService) {
  return {
    list(_req: Request, res: Response<ApiResponse<Transaction[]>>) {
      let data = service.getAll();
      if (data.length === 0) {
        data = service.ingestMessages(mockMessages);
      }
      res.json({ success: true, data });
    },

    reseed(_req: Request, res: Response<ApiResponse<Transaction[]>>) {
      const data = service.ingestMessages(mockMessages);
      res.json({ success: true, data });
    },

    updateCategory(req: Request, res: Response<ApiResponse<Transaction>>) {
      const { id } = req.params;
      const { category } = req.body as { category?: string };

      if (!category || !VALID_CATEGORIES.includes(category as Category)) {
        return res.status(400).json({ success: false, error: "Invalid category" });
      }

      const updated = service.reassignCategory(id, category as Category);
      if (!updated) {
        return res.status(404).json({ success: false, error: "Transaction not found" });
      }

      res.json({ success: true, data: updated });
    },
  };
}
