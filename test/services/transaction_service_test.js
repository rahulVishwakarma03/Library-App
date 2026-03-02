import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { DatabaseSync } from "node:sqlite";
import { DbClient } from "../../src/db_client.js";
import { listBorrowedBooks } from "../../src/services/transaction_service.js";
import { mockReqDetails } from "../../data/mock_requests.js";
import { registerMember } from "../../src/services/member_service.js";
import { addBook, borrowBook } from "../../src/services/book_service.js";

describe("Transaction service", () => {
  let dbClient;
  beforeEach(() => {
    const db = new DatabaseSync(":memory:");
    dbClient = new DbClient(db);
    dbClient.initializeSchema();
    const regDetails = mockReqDetails.regDetails;
    const bookDetails = mockReqDetails.bookDetails;
    registerMember(dbClient, regDetails);
    addBook(dbClient, bookDetails);
    borrowBook(dbClient, { bookId: 1, memberId: 1 });
  });

  describe("List all borrowed books by a member", () => {
    it("should list all borrowed books by a member", () => {
      const res = listBorrowedBooks(dbClient, { memberId: 1 });
      assertEquals(res.success, true);
      assertEquals(res.data.borrowedBooks[0].bookId, 1);
    });
  });
});
