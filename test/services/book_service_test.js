import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import { DatabaseSync } from "node:sqlite";
import { mockRequests } from "../../data/mock_requests.js";
import { addBook } from "../../src/services/book_service.js";
import { DbClient } from "../../src/db_client.js";
import { ValidationError } from "../../src/utils/custom_errors.js";

describe("Book services", () => {
  let dbClient;
  let registrationDetails;
  let loginDetails;
  let bookDetails;
  beforeEach(() => {
    const db = new DatabaseSync(":memory:");
    dbClient = new DbClient(db);
    dbClient.initializeSchema();
    registrationDetails = mockRequests.registerAdmin.body;
    loginDetails = mockRequests.loginAdmin.body;
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
  });
});
