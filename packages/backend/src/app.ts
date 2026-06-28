import express from "express";
import cors from "cors";
import { TransactionService } from "./services/transactionService";
import { InMemoryTransactionRepository } from "./repository/InMemoryTransactionRepository";
import { createTransactionRoutes } from "./routes/transactionRoutes";

const app = express();
app.use(cors());
app.use(express.json());

const repository = new InMemoryTransactionRepository();
const transactionService = new TransactionService(repository);

app.use("/api", createTransactionRoutes(transactionService));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}

export default app;
