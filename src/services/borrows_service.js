import { NotFoundError } from "../utils/custom_errors.js";

export const borrowsRouteHandler = {
  "/borrows/borrow": (library, data) => library.borrowBook(data),
  "/borrows/return": (library, data) => library.returnBook(data),
  "/borrows/list": (library, data) => library.listBorrowed(data),
};

export const handleBorrowService = async (library, request) => {
  const { url, method } = request;
  const path = new URL(url).pathname;

  if (method === "POST" && path in borrowsRouteHandler) {
    const body = await request.json();
    const handler = borrowsRouteHandler[path];
    return await handler(library, body);
  }
  throw new NotFoundError("Path not found");
};
