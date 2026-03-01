import {
  addBook,
  listAllBooks,
  removeBook,
  updateQuantity,
} from "../services/book_service.js";
import { isInteger } from "../utils/utils.js";
import { isString, validateInputType } from "../utils/utils.js";

export const addBookController = async (c) => {
  const dbClient = c.get("dbClient");
  const { title, author, total } = await c.req.json();

  validateInputType({ title, author }, isString);
  validateInputType({ total }, isInteger);

  const res = addBook(dbClient, { title, author, total });
  return c.json(res, 201);
};

export const removeBookController = async (c) => {
  const dbClient = c.get("dbClient");
  const { bookId } = await c.req.json();

  validateInputType({ bookId }, isInteger);

  const res = removeBook(dbClient, { bookId });
  return c.json(res, 200);
};

export const updateQuantityController = async (c) => {
  const dbClient = c.get("dbClient");
  const { bookId, quantity } = await c.req.json();
  validateInputType({ bookId, quantity }, isInteger);

  const res = updateQuantity(dbClient, { bookId, quantity });
  return c.json(res, 200);
};

export const listAllBooksController = (c) => {
  const dbClient = c.get("dbClient");
  const res = listAllBooks(dbClient);
  return c.json(res, 200);
};
