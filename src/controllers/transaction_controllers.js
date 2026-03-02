import { getCookie } from "hono/cookie";
import { listBorrowedBooks } from "../services/transaction_service.js";

export const listBorrowedController = (c) => {
  const dbClient = c.get("dbClient");
  const memberId = getCookie(c, "memberId");
  const res = listBorrowedBooks(dbClient, { memberId: Number(memberId) });

  return c.json(res, 200);
};
