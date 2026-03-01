import { Hono } from "hono";
import { addBookController } from "../controllers/book_controllers.js";
import { NotFoundError } from "../utils/custom_errors.js";
import { authenticateAdmin, authenticateMember } from "../middlewares.js";

export const createBookRoutes = () => {
  const book = new Hono();

  book.post("/add", authenticateAdmin, addBookController);

  book.notFound(() => {
    throw new NotFoundError("Invalid path");
  });

  return book;
};
