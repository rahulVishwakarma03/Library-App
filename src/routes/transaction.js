import { Hono } from "hono";
import { authenticateMember } from "../middlewares.js";
import { listBorrowedController } from "../controllers/transaction_controllers.js";

export const createTransactionRoutes = () => {
  const transaction = new Hono();

  transaction.get("/list-borrowed", authenticateMember, listBorrowedController);

  return transaction;
};
