import { Hono } from "hono";
import {
  addBookController,
  borrowBookController,
  listAllBooksController,
  removeBookController,
  returnBookController,
  updateQuantityController,
} from "../controllers/book_controllers.js";
import {
  authenticateAdmin,
  authenticateAdminOrMember,
  authenticateMember,
} from "../middlewares.js";

import { sValidator } from "@hono/standard-validator";
import {
  bookIdSchema,
  bookSchema,
  transIdSchema,
  updateQuantitySchema,
} from "../validation_schema.js";

export const createBookRoutes = () => {
  const book = new Hono();

  book.post(
    "/add",
    authenticateAdmin,
    sValidator("json", bookSchema),
    addBookController,
  );

  book.post(
    "/remove",
    authenticateAdmin,
    sValidator("json", bookIdSchema),
    removeBookController,
  );

  book.post(
    "/update-quantity",
    authenticateAdmin,
    sValidator("json", updateQuantitySchema),
    updateQuantityController,
  );
  book.get("/list-all", authenticateAdminOrMember, listAllBooksController);
  book.post(
    "/borrow",
    authenticateMember,
    sValidator("json", bookIdSchema),
    borrowBookController,
  );
  book.post(
    "/return",
    authenticateMember,
    sValidator("json", transIdSchema),
    returnBookController,
  );

  return book;
};
