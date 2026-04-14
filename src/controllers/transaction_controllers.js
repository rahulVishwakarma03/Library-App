import { getCookie } from "hono/cookie";
import {
  listAllTransactions,
  listBorrowedBooks,
} from "../services/transaction_service.js";

export const listBorrowedController = (c) => {
  const dbClient = c.get("dbClient");
  const session = c.get("session");
  const sessionId = Number(getCookie(c, "sessionId"));
  const memberId = session.getUser(sessionId);
  const res = listBorrowedBooks(dbClient, { memberId: Number(memberId) });

  return c.json(res, 200);
};

export const listAllTransactionsController = (c) => {
  const dbClient = c.get("dbClient");
  const res = listAllTransactions(dbClient);

  return c.json(res, 200);
};
