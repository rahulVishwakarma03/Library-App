import { AuthenticationError, NotFoundError } from "../utils/custom_errors.js";
import { createResponse } from "../utils/req_res_generator.js";
import { extractBearerToken, validateInputType } from "../utils/utils.js";

export const isPositiveInteger = (el) => Number.isInteger(el) && el > 0;

const authorizeMember = (dbClient, request) => {
  const authToken = extractBearerToken(request);
  const member = dbClient.findMemberById({ memberId: authToken });
  if (!member) {
    throw new AuthenticationError("Unauthorized!");
  }
};

export const borrowBook = (dbClient, { bookId, memberId }) => {
  validateInputType({ bookId, memberId }, isPositiveInteger);

  const book = dbClient.findBookById({ bookId });
  const member = dbClient.findMemberById({ memberId });

  if (!book || !member) {
    throw new NotFoundError("bookId or memberId doesn't exist");
  }

  if (book.borrowed === book.total) {
    throw new NotFoundError("No copy is available");
  }

  const res = dbClient.borrowBook({ bookId, memberId });

  return createResponse(200, {
    success: true,
    data: { transactionId: res.lastInsertedRowid },
    message: "Book borrowed successfully",
  });
};

export const returnBook = (dbClient, { transactionId }) => {
  validateInputType({ transactionId }, isPositiveInteger);

  const transaction = dbClient.findTransactionById({ transactionId });

  if (!transaction) {
    throw new NotFoundError("Transaction id not found");
  }

  dbClient.returnBook({ transactionId });
  return createResponse(200, {
    success: true,
    message: "Book returned successfully",
  });
};

export const listBorrowed = (dbClient, { memberId }) => {
  validateInputType({ memberId }, isPositiveInteger);

  const borrowedBooks = dbClient.findBorrowedBooksByMemberId({ memberId });
  return createResponse(200, {
    success: true,
    data: { borrowedBooks },
    message: "Successful",
  });
};

// /borrows/list should be a GET method and parse the searchParams to get the memberId
export const borrowsRouteHandler = {
  "/borrows/borrow": (library, data) => library.borrowBook(data),
  "/borrows/return": (library, data) => library.returnBook(data),
  "/borrows/list": (library, data) => library.listBorrowed(data),
};

export const handleBorrowService = async (library, request) => {
  const { url, method } = request;
  const path = new URL(url).pathname;

  if (method === "POST" && path in borrowsRouteHandler) {
    // authorizeMember(dbClient, request);
    const body = await request.json();
    const handler = borrowsRouteHandler[path];
    return await handler(library, body);
  }
  throw new NotFoundError("Path not found");
};
