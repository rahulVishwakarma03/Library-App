import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import { DatabaseSync } from "node:sqlite";
import { DbClient } from "../../src/db_client.js";
import { listBorrowed } from "../../src/services/transaction_service.js";
import { ValidationError } from "../../src/utils/custom_errors.js";
import { mockReqDetails } from "../../data/mock_requests.js";
import { registerMember } from "../../src/services/member_service.js";

describe.ignore("Transaction service", () => {
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
      registerMember(dbClient, regDetails);
      dbClient.createBook(bookDetails);
      borrowBook(dbClient, { bookId: 1, memberId: 1 });
      const res = listBorrowed(dbClient, { memberId: 1 });
      const body = await res.json();
      assertEquals(res.status, 200);
      assertEquals(body.data.borrowedBooks[0].bookId, 1);
    });
  });
});
