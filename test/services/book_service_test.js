import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import { DatabaseSync } from "node:sqlite";
import { mockReqDetails } from "../../data/mock_requests.js";
import {
  addBook,
  borrowBook,
  listAllBooks,
  removeBook,
  returnBook,
  updateQuantity,
} from "../../src/services/book_service.js";
import { DbClient } from "../../src/db_client.js";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../src/utils/custom_errors.js";
import { registerMember } from "../../src/services/member_service.js";

describe("Book services", () => {
  let dbClient;
  let regDetails;
  let bookDetails;
  beforeEach(() => {
    const db = new DatabaseSync(":memory:");
    dbClient = new DbClient(db);
    dbClient.initializeSchema();
    regDetails = mockReqDetails.regDetails;
    bookDetails = mockReqDetails.bookDetails;
  });

  describe("Add a book", () => {
    it("should throw validation error if total is less than 1", () => {
      assertThrows(
        () => addBook(dbClient, { ...bookDetails, total: 0 }),
        ValidationError,
        "Total cannot be less than one",
      );
    });

    it("should add book", () => {
      assertEquals(addBook(dbClient, bookDetails).success, true);
    });

    it("should throw conflict error if book already exists", () => {
      addBook(dbClient, bookDetails);
      assertThrows(
        () => addBook(dbClient, bookDetails),
        ConflictError,
        "Book already exists",
      );
    });
  });

  describe("Remove a book", () => {
    it("should throw not found error if book is not present", () => {
      assertThrows(
        () => removeBook(dbClient, { bookId: 1 }),
        NotFoundError,
        "Book not found",
      );
    });

    it("should throw conflict error if some book copies are still borrowed", () => {
      registerMember(dbClient, regDetails);
      addBook(dbClient, bookDetails);
      borrowBook(dbClient, { bookId: 1, memberId: 1 });
      assertThrows(
        () => removeBook(dbClient, { bookId: 1 }),
        ConflictError,
        "Cannot delete book",
      );
    });

    it("should delete book", () => {
      addBook(dbClient, bookDetails);
      assertEquals(removeBook(dbClient, { bookId: 1 }).success, true);
    });
  });

  describe("Update book quantity", () => {
    it("should throw conflict error if given quantity is less than borrowed quantity", () => {
      registerMember(dbClient, regDetails);
      addBook(dbClient, bookDetails);
      borrowBook(dbClient, { memberId: 1, bookId: 1 });
      borrowBook(dbClient, { memberId: 1, bookId: 1 });
      borrowBook(dbClient, { memberId: 1, bookId: 1 });
      assertThrows(
        () => updateQuantity(dbClient, { bookId: 1, quantity: 2 }),
      );
    });

    it("should update the total book copies quantity", () => {
      registerMember(dbClient, regDetails);
      addBook(dbClient, bookDetails);
      assertEquals(dbClient.findBookById({ bookId: 1 }).total, 5);
      assertEquals(
        updateQuantity(dbClient, { bookId: 1, quantity: 10 }).success,
        true,
      );
      assertEquals(dbClient.findBookById({ bookId: 1 }).total, 10);
    });
  });

  describe("List all books", () => {
    it("should list all books", () => {
      addBook(dbClient, bookDetails);
      const res = listAllBooks(dbClient);
      assertEquals(res.success, true);
      assertEquals(res.data.books[0].bookId, 1);
    });
  });

  describe("borrow book", () => {
    beforeEach(() => {
      registerMember(dbClient, regDetails);
      addBook(dbClient, { ...bookDetails, total: 1 });
    });

    it("should throw not found error if given bookId doesn't exist", () => {
      assertThrows(
        () => borrowBook(dbClient, { bookId: 2, memberId: 1 }),
        NotFoundError,
        "bookId doesn't exist",
      );
    });

    it("should borrow book", () => {
      const response = borrowBook(dbClient, { bookId: 1, memberId: 1 });
      assertEquals(response.success, true);
    });

    it("should throw Not found error if no copy is available", () => {
      borrowBook(dbClient, { bookId: 1, memberId: 1 });
      assertThrows(
        () => borrowBook(dbClient, { bookId: 1, memberId: 1 }),
        NotFoundError,
        "No copy is available",
      );
    });
  });

  describe("Return book", () => {
    beforeEach(() => {
      registerMember(dbClient, regDetails);
      addBook(dbClient, { ...bookDetails, total: 1 });
      borrowBook(dbClient, { bookId: 1, memberId: 1 });
    });

    it("should throw not found error if given transactionId doesn't exist", () => {
      assertThrows(
        () => returnBook(dbClient, { transactionId: 2 }),
        NotFoundError,
        "Transaction id not found",
      );
    });

    it("should return the book", () => {
      assertEquals(returnBook(dbClient, { transactionId: 1 }).success, true);
    });
  });
});
