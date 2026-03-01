import { addBook } from "../services/book_service.js";
import { isPositiveInteger } from "../services/borrows_service.js";
import { isString, validateInputType } from "../utils/utils.js";

export const addBookController = async (c) => {
  const dbClient = c.get("dbClient");
  const { title, author, total } = await c.req.json();

  validateInputType({ title, author }, isString);
  validateInputType({ total }, isPositiveInteger);

  const res = addBook(dbClient, { title, author, total });
  return c.json(res, 201);
};
