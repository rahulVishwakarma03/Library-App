import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { mockReqDetails } from "../../data/mock_requests.js";
import { DatabaseSync } from "node:sqlite";
import { DbClient } from "../../src/db_client.js";
import { createAPP } from "../../src/app.js";

describe("Book Route /books", () => {
  let app;
  let regDetails;
  let loginDetails;
  let bookDetails;
  let cookie;
  beforeEach(async () => {
    const db = new DatabaseSync(":memory:");
    const dbClient = new DbClient(db);
    dbClient.initializeSchema();
    app = createAPP(dbClient);
    regDetails = mockReqDetails.regDetails;
    loginDetails = mockReqDetails.loginDetails;
    bookDetails = mockReqDetails.bookDetails;
    await app.request("/admins/register", {
      method: "POST",
      body: JSON.stringify(regDetails),
    });
    const res = await app.request("/admins/login", {
      method: "POST",
      body: JSON.stringify(loginDetails),
    });
    cookie = res.headers.get("set-cookie");
  });

  it("should fail if path is /books/invalid", async () => {
    const res = await app.request("/books/invalid");
    assertEquals(res.status, 404);
  });

  describe("POST /book/add", () => {
    it("should fail with authentication error(401) if cookie is not provided", async () => {
      const response = await app.request("/books/add", {
        method: "POST",
        body: JSON.stringify(bookDetails),
      });
      assertEquals(response.status, 401);
    });

    it("should fail with validation error(400) if book details are not provided", async () => {
      const response = await app.request("/books/add", {
        method: "POST",
        headers: { cookie },
        body: JSON.stringify({}),
      });
      assertEquals(response.status, 400);
    });

    it("should fail with validation error(400) if book details are not invalid", async () => {
      const response = await app.request("/books/add", {
        method: "POST",
        headers: { cookie },
        body: JSON.stringify({ title: 123, author: 124, total: "" }),
      });

      assertEquals(response.status, 400);
    });

    it("should add book", async () => {
      const response = await app.request("/books/add", {
        method: "POST",
        headers: { cookie },
        body: JSON.stringify(bookDetails),
      });

      assertEquals(response.status, 201);
    });
  });
});
