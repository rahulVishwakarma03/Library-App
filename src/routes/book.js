import { Hono } from "hono";
import {
  addBookController,
  listAllBooksController,
  removeBookController,
  updateQuantityController,
} from "../controllers/book_controllers.js";
import { NotFoundError } from "../utils/custom_errors.js";
import {
  authenticateAdmin,
  authenticateAdminOrMember,
} from "../middlewares.js";

export const createBookRoutes = () => {
  const book = new Hono();

  book.post("/add", authenticateAdmin, addBookController);
  book.post("/remove", authenticateAdmin, removeBookController);
  book.post("/update-quantity", authenticateAdmin, updateQuantityController);
  book.get("/list-all", authenticateAdminOrMember, listAllBooksController);

  book.notFound(() => {
    throw new NotFoundError("Invalid path");
  });

  return book;
};
