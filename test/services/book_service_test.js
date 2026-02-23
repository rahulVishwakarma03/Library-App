import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import { DatabaseSync } from "node:sqlite";
import { mockRequests } from "../../data/mock_requests.js";
import {
  addBook,
  listAllBooks,
  removeBook,
  updateQuantity,
} from "../../src/services/book_service.js";
import { DbClient } from "../../src/db_client.js";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../src/utils/custom_errors.js";
import { borrowBook } from "../../src/services/borrows_service.js";
import { registerMember } from "../../src/services/member_service.js";

describe("Book services", () => {
  let dbClient;
  let registrationDetails;
  let bookDetails;
  beforeEach(() => {
    const db = new DatabaseSync(":memory:");
    dbClient = new DbClient(db);
    dbClient.initializeSchema();
    registrationDetails = mockRequests.registerAdmin.body;
    bookDetails = mockRequests.addBook.body;
  });

  describe("Add a book", () => {
    it("should throw validation error if input format is  Invalid", () => {
      assertThrows(
        () => addBook(dbClient, { title: 2, author: "", total: undefined }),
        ValidationError,
        "Invalid input format",
      );
    });

    it("should throw validation error if total is less than 1", () => {
      assertThrows(
        () => addBook(dbClient, { title: "book1", author: "abc", total: 0 }),
        ValidationError,
        "Invalid input format",
      );
    });

    it("should add book", () => {
      assertEquals(addBook(dbClient, bookDetails).status, 201);
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
    it("should throw validation error if input format is  Invalid", () => {
      assertThrows(
        () => removeBook(dbClient, { bookId: "123" }),
        ValidationError,
        "Invalid input format",
      );
    });
    
    it("should throw not found error if book is not present", () => {
      assertThrows(
        () => removeBook(dbClient, { bookId: 1 }),
        NotFoundError,
        "Book not found",
      );
    });

    it("should throw conflict error if some book copies are still borrowed", () => {
      registerMember(dbClient, registrationDetails);
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
      assertEquals(removeBook(dbClient, { bookId: 1 }).status, 200);
    });
  });

  describe("Update book quantity", () => {
    it("should throw validation error if input format is  Invalid", () => {
      assertThrows(
        () => updateQuantity(dbClient, { bookId: "abc", quantity: "12" }),
        ValidationError,
        "Invalid input format",
      );
    });

    it("should throw conflict error if given quantity is less than borrowed quantity", () => {
      registerMember(dbClient, registrationDetails);
      addBook(dbClient, bookDetails);
      borrowBook(dbClient, { memberId: 1, bookId: 1 });
      borrowBook(dbClient, { memberId: 1, bookId: 1 });
      borrowBook(dbClient, { memberId: 1, bookId: 1 });
      assertThrows(
        () => updateQuantity(dbClient, { bookId: 1, quantity: 2 }),
      );
    });

    it("should update the total book copies quantity", () => {
      registerMember(dbClient, registrationDetails);
      addBook(dbClient, bookDetails);
      assertEquals(dbClient.findBookById({ bookId: 1 }).total, 5);
      assertEquals(
        updateQuantity(dbClient, { bookId: 1, quantity: 10 }).status,
        200,
      );
      assertEquals(dbClient.findBookById({ bookId: 1 }).total, 10);
    });
  });

  describe("List all books", () => {
    it("should list all books", async () => {
      addBook(dbClient, bookDetails);
      const res = listAllBooks(dbClient);
      const body = await res.json();
      assertEquals(res.status, 200);
      assertEquals(body.data.books[0].bookId, 1);
    });
  });
});
