import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../utils/custom_errors.js";
import { createResponse } from "../utils/req_res_generator.js";
import { isString, validateInputType } from "../utils/utils.js";
import { isPositiveInteger } from "./borrows_service.js";
// import { authorizeAdmin } from "./member_service.js";

export const addBook = (dbClient, { title, author, total }) => {
  if (total < 1) {
    throw new ValidationError("Total cannot be less than one");
  }
  const existingBook = dbClient.findBookByTitleAndAuthor({ title, author });

  if (existingBook) {
    throw new ConflictError("Book already exists");
  }

  const res = dbClient.createBook({ title, author, total });
  return {
    success: true,
    data: { bookId: res.lastInsertRowid },
    message: "Book added successfully",
  };
};

export const removeBook = (dbClient, { bookId }) => {
  const book = dbClient.findBookById({ bookId });

  if (!book) {
    throw new NotFoundError("Book not found");
  }

  if (book.borrowed !== 0) {
    throw new ConflictError(
      "Cannot delete book, Some copies are still borrowed!",
    );
  }

  dbClient.deleteBook({ bookId });

  return {
    success: true,
    message: "Book deleted successfully",
  };
};

export const updateQuantity = (dbClient, { bookId, quantity }) => {
  // validateInputType({ bookId, quantity }, isPositiveInteger);
  const book = dbClient.findBookById({ bookId });

  if (quantity < book.borrowed) {
    throw new ConflictError(
      "Total quantity cannot be less than borrowed quantity",
    );
  }

  dbClient.updateBookQuantity({ bookId, quantity });

  return {
    success: true,
    message: "Book quantity updated successfully",
  };
};

export const listAllBooks = (dbClient) => {
  const books = dbClient.findAllBooks();

  return {
    success: true,
    data: { books },
    message: "Successful",
  };
};
