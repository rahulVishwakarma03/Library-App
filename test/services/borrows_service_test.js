import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import { DatabaseSync } from "node:sqlite";
import { DbClient } from "../../src/db_client.js";
import {
  borrowBook,
  listBorrowed,
  returnBook,
} from "../../src/services/borrows_service.js";
import {
  NotFoundError,
  ValidationError,
} from "../../src/utils/custom_errors.js";
import { mockRequests } from "../../data/mock_requests.js";
import { registerMember } from "../../src/services/member_service.js";

describe("Borrows service", () => {
  let dbClient;
  let registrationDetails;
  let bookDetails;
  beforeEach(() => {
    const db = new DatabaseSync(":memory:");
    dbClient = new DbClient(db);
    dbClient.initializeSchema();
    registrationDetails = mockRequests.registerMember.body;
    bookDetails = mockRequests.addBook.body;
  });

  describe("borrow book", () => {
    it("should throw validation error if inputs are not provided", () => {
      assertThrows(
        () => borrowBook(dbClient, {}),
        ValidationError,
        "Invalid input format",
      );
    });
  });

  it("should throw validation error if input type is not valid", () => {
    assertThrows(
      () => borrowBook(dbClient, { bookId: "abc", memberId: "123" }),
      ValidationError,
      "Invalid input format",
    );
  });

  it("should throw validation error if given adminId or bookId doesn't exist", () => {
    assertThrows(
      () => borrowBook(dbClient, { bookId: 1, memberId: 1 }),
      NotFoundError,
      "bookId or memberId doesn't exist",
    );
  });

  it("should borrow book", () => {
    registerMember(dbClient, registrationDetails);
    dbClient.createBook(bookDetails);
    assertEquals(borrowBook(dbClient, { bookId: 1, memberId: 1 }).status, 200);
  });

  it("should throw Not found error if no copy is available", () => {
    registerMember(dbClient, registrationDetails);
    dbClient.createBook({ ...bookDetails, total: 1 });
    borrowBook(dbClient, { bookId: 1, memberId: 1 });
    assertThrows(
      () => borrowBook(dbClient, { bookId: 1, memberId: 1 }),
      NotFoundError,
      "No copy is available",
    );
  });

  describe("Return a book", () => {
    it("should throw validation error if inputs are not provided", () => {
      assertThrows(
        () => returnBook(dbClient, {}),
        ValidationError,
        "Invalid input format",
      );
    });

    it("should throw validation error if input type is not valid", () => {
      assertThrows(
        () => returnBook(dbClient, { transactionId: "abc" }),
        ValidationError,
        "Invalid input format",
      );
    });

    it("should throw not found error if given transactionId doesn't exist", () => {
      assertThrows(
        () => returnBook(dbClient, { transactionId: 1 }),
        NotFoundError,
        "Transaction id not found",
      );
    });

    it("should return the book", () => {
      registerMember(dbClient, registrationDetails);
      dbClient.createBook(bookDetails);
      borrowBook(dbClient, { bookId: 1, memberId: 1 });
      assertEquals(returnBook(dbClient, { transactionId: 1 }).status, 200);
    });
  });

  describe("List all borrowed books by a member", () => {
    it("should throw validation error if inputs are not provided", () => {
      assertThrows(
        () => listBorrowed(dbClient, {}),
        ValidationError,
        "Invalid input format",
      );
    });

    it("should throw validation error if input type is not valid", () => {
      assertThrows(
        () => listBorrowed(dbClient, { memberId: "abc" }),
        ValidationError,
        "Invalid input format",
      );
    });

    it("should list all borrowed by a member", async () => {
      registerMember(dbClient, registrationDetails);
      dbClient.createBook(bookDetails);
      borrowBook(dbClient, { bookId: 1, memberId: 1 });
      const res = listBorrowed(dbClient, { memberId: 1 });
      const body = await res.json();
      assertEquals(res.status, 200);
      assertEquals(body.data.borrowedBooks[0].bookId, 1);
    });
  });
});
