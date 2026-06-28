import { Router } from "express";
import { createTransactionController } from "../controllers/transactionController";
import { TransactionService } from "../services/transactionService";

export function createTransactionRoutes(service: TransactionService): Router {
  const router = Router();
  const controller = createTransactionController(service);

  router.get("/transactions", controller.list);
  router.post("/transactions/reseed", controller.reseed);
  router.patch("/transactions/:id/category", controller.updateCategory);

  return router;
}
