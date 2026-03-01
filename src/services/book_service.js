import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../utils/custom_errors.js";

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
  if (quantity < 1) {
    throw new ValidationError("Total quantity can not be zero");
  }

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

export const borrowBook = (dbClient, { bookId, memberId }) => {
  const book = dbClient.findBookById({ bookId });

  if (!book) {
    throw new NotFoundError("bookId doesn't exist");
  }

  if (book.borrowed === book.total) {
    throw new NotFoundError("No copy is available");
  }

  const res = dbClient.borrowBook({ bookId, memberId });

  return {
    success: true,
    data: { transactionId: res.lastInsertedRowid },
    message: "Book borrowed successfully",
  };
};

export const returnBook = (dbClient, { transactionId }) => {
  const transaction = dbClient.findTransactionById({ transactionId });

  if (!transaction) {
    throw new NotFoundError("Transaction id not found");
  }

  dbClient.returnBook({ transactionId });
  return {
    success: true,
    message: "Book returned successfully",
  };
};
