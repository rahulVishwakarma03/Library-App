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
  let adminCookie;
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
    adminCookie = res.headers.get("set-cookie");
  });

  it("should fail if path is /books/invalid", async () => {
    const res = await app.request("/books/invalid");
    assertEquals(res.status, 404);
  });

  describe("POST /books/add", () => {
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
        headers: { cookie: adminCookie },
        body: JSON.stringify({}),
      });
      assertEquals(response.status, 400);
    });

    it("should fail with validation error(400) if book details are not invalid", async () => {
      const response = await app.request("/books/add", {
        method: "POST",
        headers: { cookie: adminCookie },
        body: JSON.stringify({ title: 123, author: 124, total: "" }),
      });

      assertEquals(response.status, 400);
    });

    it("should add book", async () => {
      const response = await app.request("/books/add", {
        method: "POST",
        headers: { cookie: adminCookie },
        body: JSON.stringify(bookDetails),
      });

      assertEquals(response.status, 201);
    });
  });

  describe("POST /books/remove", () => {
    beforeEach(async () => {
      await app.request("/books/add", {
        method: "POST",
        headers: { cookie: adminCookie },
        body: JSON.stringify(bookDetails),
      });
    });

    it("should fail with authentication error(401) if cookie is not provided", async () => {
      const response = await app.request("/books/remove", {
        method: "POST",
        body: JSON.stringify(bookDetails),
      });
      assertEquals(response.status, 401);
    });

    it("should fail with validation error(400) if book id are not provided", async () => {
      const response = await app.request("/books/remove", {
        method: "POST",
        headers: { cookie: adminCookie },
        body: JSON.stringify({}),
      });
      assertEquals(response.status, 400);
    });

    it("should fail with validation error(400) if book id are not invalid", async () => {
      const response = await app.request("/books/remove", {
        method: "POST",
        headers: { cookie: adminCookie },
        body: JSON.stringify({ bookId: "1" }),
      });

      assertEquals(response.status, 400);
    });

    it("should remove book", async () => {
      const response = await app.request("/books/remove", {
        method: "POST",
        headers: { cookie: adminCookie },
        body: JSON.stringify({ bookId: 1 }),
      });

      assertEquals(response.status, 200);
    });
  });

  describe("POST /books/update-quantity", () => {
    beforeEach(async () => {
      await app.request("/books/add", {
        method: "POST",
        headers: { cookie: adminCookie },
        body: JSON.stringify(bookDetails),
      });
    });

    it("should fail with authentication error(401) if cookie is not provided", async () => {
      const response = await app.request("/books/update-quantity", {
        method: "POST",
        body: JSON.stringify(bookDetails),
      });
      assertEquals(response.status, 401);
    });

    it("should fail with validation error(400) if book id and quantity are invalid", async () => {
      const response = await app.request("/books/update-quantity", {
        method: "POST",
        headers: { cookie: adminCookie },
        body: JSON.stringify({ bookId: "1", quantity: "3" }),
      });
      assertEquals(response.status, 400);
    });

    it("should fail with validation error(400) if quantity is less than one", async () => {
      const response = await app.request("/books/update-quantity", {
        method: "POST",
        headers: { cookie: adminCookie },
        body: JSON.stringify({ bookId: 1, quantity: 0 }),
      });

      assertEquals(response.status, 400);
    });

    it("should fail with conflict error(409) if quantity is less than total borrowed", async () => {
      await app.request("/members/register", {
        method: "POST",
        body: JSON.stringify(regDetails),
      });

      const memberLoginRes = await app.request("/members/login", {
        method: "POST",
        body: JSON.stringify(loginDetails),
      });

      const memberCookie = memberLoginRes.headers.get("set-cookie");

      app.request("/books/borrow", {
        method: "POST",
        headers: { cookie: memberCookie },
        body: JSON.stringify({ bookId: 1, memberId: 1 }),
      });

      app.request("/books/borrow", {
        method: "POST",
        headers: { cookie: memberCookie },
        body: JSON.stringify({ bookId: 1, memberId: 1 }),
      });

      const response = await app.request("/books/update-quantity", {
        method: "POST",
        headers: { cookie: adminCookie },
        body: JSON.stringify({ bookId: 1, quantity: 1 }),
      });

      assertEquals(response.status, 409);
    });

    it("should update quantity", async () => {
      const response = await app.request("/books/update-quantity", {
        method: "POST",
        headers: { cookie: adminCookie },
        body: JSON.stringify({ bookId: 1, quantity: 10 }),
      });

      assertEquals(response.status, 200);
      assertEquals((await response.json()).success, true);
    });
  });

  describe("GET /books/list-all", () => {
    beforeEach(async () => {
      await app.request("/books/add", {
        method: "POST",
        headers: { cookie: adminCookie },
        body: JSON.stringify(bookDetails),
      });
    });

    it("should fail with authentication error(401) if cookie is not provided", async () => {
      const response = await app.request("/books/list-all");
      assertEquals(response.status, 401);
    });

    it("should list all the books", async () => {
      const response = await app.request("/books/list-all", {
        method: "GET",
        headers: { cookie: adminCookie },
      });

      assertEquals(response.status, 200);
      assertEquals((await response.json()).success, true);
    });
  });

  describe("POST /books/borrow", () => {
    let memberCookie;
    beforeEach(async () => {
      await app.request("/books/add", {
        method: "POST",
        headers: { "cookie": adminCookie },
        body: JSON.stringify(bookDetails),
      });

      await app.request("/members/register", {
        method: "POST",
        body: JSON.stringify(regDetails),
      });

      const memberLoginRes = await app.request("/members/login", {
        method: "POST",
        body: JSON.stringify(loginDetails),
      });

      memberCookie = memberLoginRes.headers.get("set-cookie");
    });

    it("should fail with authentication error(401) if cookie is not provided", async () => {
      const response = await app.request("/books/borrow", {
        method: "POST",
        body: JSON.stringify({ bookId: 1 }),
      });
      assertEquals(response.status, 401);
    });

    it("should fail with validation error(400) if bookId are not provided", async () => {
      const response = await app.request("/books/borrow", {
        method: "POST",
        headers: { cookie: memberCookie },
        body: JSON.stringify({}),
      });
      assertEquals(response.status, 400);
    });

    it("should borrow book", async () => {
      const response = await app.request("/books/borrow", {
        method: "POST",
        headers: { cookie: memberCookie },
        body: JSON.stringify({ bookId: 1, memberId: 1 }),
      });

      assertEquals((await response.json()).success, true);
      assertEquals(response.status, 200);
    });
  });

  describe("POST /books/return", () => {
    let memberCookie;
    beforeEach(async () => {
      await app.request("/books/add", {
        method: "POST",
        headers: { "cookie": adminCookie },
        body: JSON.stringify(bookDetails),
      });

      await app.request("/members/register", {
        method: "POST",
        body: JSON.stringify(regDetails),
      });

      const memberLoginRes = await app.request("/members/login", {
        method: "POST",
        body: JSON.stringify(loginDetails),
      });

      memberCookie = memberLoginRes.headers.get("set-cookie");
      app.request("/books/borrow", {
        method: "POST",
        headers: { cookie: memberCookie },
        body: JSON.stringify({ bookId: 1, memberId: 1 }),
      });
    });

    it("should fail with authentication error(401) if cookie is not provided", async () => {
      const response = await app.request("/books/return", {
        method: "POST",
        body: JSON.stringify({ bookId: 1 }),
      });
      assertEquals(response.status, 401);
    });

    it("should fail with validation error(400) if transactionId are not provided", async () => {
      const response = await app.request("/books/return", {
        method: "POST",
        headers: { cookie: memberCookie },
        body: JSON.stringify({}),
      });
      assertEquals(response.status, 400);
    });

    it("should return the book", async () => {
      const response = await app.request("/books/return", {
        method: "POST",
        headers: { cookie: memberCookie },
        body: JSON.stringify({ transactionId: 1 }),
      });

      assertEquals((await response.json()).success, true);
      assertEquals(response.status, 200);
    });
  });
});
