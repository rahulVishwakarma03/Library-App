import { getCookie } from "hono/cookie";
import * as bookServices from "../services/book_service.js";

export const addBookController = async (c) => {
  const dbClient = c.get("dbClient");
  const { title, author, total } = await c.req.valid("json");

  const res = bookServices.addBook(dbClient, { title, author, total });
  return c.json(res, 201);
};

export const removeBookController = async (c) => {
  const dbClient = c.get("dbClient");
  const { bookId } = await c.req.valid("json");

  const res = bookServices.removeBook(dbClient, { bookId });
  return c.json(res, 200);
};

export const updateQuantityController = async (c) => {
  const dbClient = c.get("dbClient");
  const { bookId, quantity } = await c.req.valid("json");

  const res = bookServices.updateQuantity(dbClient, { bookId, quantity });
  return c.json(res, 200);
};

export const listAllBooksController = (c) => {
  const dbClient = c.get("dbClient");
  const res = bookServices.listAllBooks(dbClient);
  return c.json(res, 200);
};

export const borrowBookController = async (c) => {
  const dbClient = c.get("dbClient");
  const session = c.get("session");
  const sessionId = Number(getCookie(c, "sessionId"));
  const memberId = session.getUser(sessionId);
  const { bookId } = await c.req.valid("json");

  const res = bookServices.borrowBook(dbClient, { bookId, memberId });
  return c.json(res, 200);
};

export const returnBookController = async (c) => {
  const dbClient = c.get("dbClient");
  const { transactionId } = await c.req.valid("json");

  const res = bookServices.returnBook(dbClient, { transactionId });
  return c.json(res, 200);
};
