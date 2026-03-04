import { Hono } from "hono";
import { authenticateAdmin, authenticateMember } from "../middlewares.js";
import {
  listAllTransactionsController,
  listBorrowedController,
} from "../controllers/transaction_controllers.js";

export const createTransactionRoutes = () => {
  const transaction = new Hono();

  transaction.get("/list-borrowed", authenticateMember, listBorrowedController);
  transaction.get(
    "/list-all",
    authenticateAdmin,
    listAllTransactionsController,
  );

  return transaction;
};
