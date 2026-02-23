import { ConflictError, NotFoundError } from "../utils/custom_errors.js";
import { createResponse } from "../utils/req_res_generator.js";
import { validateInputType } from "../utils/utils.js";
import { isString } from "./admin_service.js";
import { isPositiveInteger } from "./borrows_service.js";
import { authorizeAdmin } from "./member_service.js";

export const addBook = (dbClient, { title, author, total }) => {
  validateInputType({ title, author }, isString);
  validateInputType({ total }, isPositiveInteger);

  const book = dbClient.findBookByTitleAndAuthor({ title, author });

  if (book) {
    throw new ConflictError("Book already exists");
  }

  dbClient.createBook({ title, author, total });
  return createResponse(201, {
    success: true,
    message: "Book added successfully",
  });
};

export const removeBook = (dbClient, { bookId }) => {
  validateInputType({ bookId }, isPositiveInteger);

  const book = dbClient.findBookById({ bookId });

  if (!book) {
    throw new NotFoundError("Book not found");
  }

  if (book.borrowed !== 0) {
    throw new ConflictError(
      "Cannot delete book, Some book copies are still borrowed!",
    );
  }

  dbClient.deleteBook({ bookId });

  return createResponse(200, {
    success: true,
    message: "Book deleted successfully",
  });
};

export const updateQuantity = (dbClient, { bookId, quantity }) => {
  validateInputType({ bookId, quantity }, isPositiveInteger);
  const book = dbClient.findBookById({ bookId });

  if (quantity < book.borrowed) {
    throw new ConflictError(
      "Total quantity cannot be less than borrowed quantity",
    );
  }

  dbClient.updateBookQuantity({ bookId, quantity });
  return createResponse(200, {
    success: true,
    message: "Book quantity updated successfully",
  });
};

export const listAllBooks = (dbClient) => {
  const books = dbClient.findAllBooks();
  return createResponse(200, {
    success: true,
    data: { books },
    message: "Successful",
  });
};

export const bookRouteHandler = {
  GET: {
    "/books/list": listAllBooks,
  },
  POST: {
    "/books/add": addBook,
    "/books/updateQuantity": updateQuantity,
    "/books/remove": removeBook,
  },
};

export const handleBookService = async (dbClient, request) => {
  const { url, method } = request;
  const path = new URL(url).pathname;
  if (method === "GET" && path in bookRouteHandler.GET) {
    const handler = bookRouteHandler.GET[path];
    return await handler(dbClient);
  }

  if (method === "POST" && path in bookRouteHandler.POST) {
    authorizeAdmin(dbClient, request);

    const body = await request.json();
    const handler = bookRouteHandler.POST[path];
    return await handler(dbClient, body);
  }

  throw new NotFoundError("Path not found");
};
