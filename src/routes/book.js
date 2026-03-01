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

export const createBookRoutes = () => {
  const book = new Hono();

  book.post("/add", authenticateAdmin, addBookController);
  book.post("/remove", authenticateAdmin, removeBookController);
  book.post("/update-quantity", authenticateAdmin, updateQuantityController);
  book.get("/list-all", authenticateAdminOrMember, listAllBooksController);
  book.post("/borrow", authenticateMember, borrowBookController);
  book.post("/return", authenticateMember, returnBookController);

  return book;
};
