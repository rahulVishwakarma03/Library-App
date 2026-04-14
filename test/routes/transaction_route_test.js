import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { mockReqDetails } from "../../data/mock_requests.js";
import { DatabaseSync } from "node:sqlite";
import { DbClient } from "../../src/db_client.js";
import { createApp } from "../../src/app.js";

describe("Book Route /books", () => {
  let app;
  let adminCookie;
  let memberCookie;
  const headers = { "content-type": "application/json" };
  const session = {
    sessions: {},
    create(user) {
      this.sessions[1] = user;
      return 1;
    },
    getUser(id) {
      return this.sessions[id];
    },
    delete(id) {
      delete this.sessions[id];
    },
  };

  beforeEach(async () => {
    const db = new DatabaseSync(":memory:");
    const dbClient = new DbClient(db);
    dbClient.initializeSchema();
    const mockLogger = () => async (_, next) => await next();
    app = createApp(dbClient, session, mockLogger);
    const regDetails = mockReqDetails.regDetails;
    const loginDetails = mockReqDetails.loginDetails;
    const bookDetails = mockReqDetails.bookDetails;

    await app.request("/admins/register", {
      method: "POST",
      headers,
      body: JSON.stringify(regDetails),
    });

    const adminLoginRes = await app.request("/admins/login", {
      method: "POST",
      headers,
      body: JSON.stringify(loginDetails),
    });

    adminCookie = adminLoginRes.headers.get("set-cookie");

    await app.request("/members/register", {
      method: "POST",
      headers,
      body: JSON.stringify(regDetails),
    });

    const memberLoginRes = await app.request("/members/login", {
      method: "POST",
      headers,
      body: JSON.stringify(loginDetails),
    });

    memberCookie = memberLoginRes.headers.get("set-cookie");

    await app.request("/books/add", {
      method: "POST",
      headers: { cookie: adminCookie, ...headers },
      body: JSON.stringify(bookDetails),
    });

    await app.request("/books/borrow", {
      method: "POST",
      headers: { cookie: memberCookie, ...headers },
      body: JSON.stringify({ bookId: 1 }),
    });
  });

  describe("GET /transactions/list-borrowed", () => {
    it("should fail with authentication error(401) if cookie is not provided", async () => {
      const res = await app.request("/transactions/list-borrowed");
      assertEquals(res.status, 401);
    });

    it("should list borrowed books by a member", async () => {
      const res = await app.request("/transactions/list-borrowed", {
        method: "GET",
        headers: { cookie: memberCookie },
      });
      const body = await res.json();
      assertEquals(res.status, 200);
      assertEquals(body.data.borrowedBooks.length, 1);
    });
  });

  describe("GET /transactions/list-all", () => {
    it("should fail with authentication error(401) if cookie is not provided", async () => {
      const res = await app.request("/transactions/list-all");
      assertEquals(res.status, 401);
    });

    it("should list all books transactions", async () => {
      const res = await app.request("/transactions/list-all", {
        method: "GET",
        headers: { cookie: adminCookie },
      });
      const body = await res.json();
      assertEquals(res.status, 200);
      assertEquals(body.data.transactions.length, 1);
    });
  });
});
