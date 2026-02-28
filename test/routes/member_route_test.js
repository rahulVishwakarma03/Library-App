import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { mockReqDetails } from "../../data/mock_requests.js";
import { DatabaseSync } from "node:sqlite";
import { DbClient } from "../../src/db_client.js";
import { createAPP } from "../../src/app.js";

describe("Member Route /members", () => {
  let app;
  let regDetails;
  let loginDetails;
  beforeEach(() => {
    const db = new DatabaseSync(":memory:");
    const dbClient = new DbClient(db);
    dbClient.initializeSchema();
    app = createAPP(dbClient);
    regDetails = mockReqDetails.regDetails;
    loginDetails = mockReqDetails.loginDetails;
  });

  it("/members/invalid", async () => {
    const res = await app.request("/members/invalid");
    assertEquals(res.status, 404);
  });

  describe("POST /members/register", () => {
    it("should fail with validation error(404) if registration details are not provided", async () => {
      const response = await app.request("/members/register", {
        method: "POST",
        body: JSON.stringify({}),
      });

      assertEquals(response.status, 400);
    });

    it("should fail with validation error(404) if registration details are not invalid", async () => {
      const response = await app.request("/members/register", {
        method: "POST",
        body: JSON.stringify({ name: 123, email: 124, password: 123 }),
      });

      assertEquals(response.status, 400);
    });

    it("should register member", async () => {
      const response = await app.request("/members/register", {
        method: "POST",
        body: JSON.stringify(regDetails),
      });

      assertEquals(response.status, 201);
    });

    it("should fail with conflict error(409) if member already exists", async () => {
      app.request("/members/register", {
        method: "POST",
        body: JSON.stringify(regDetails),
      });

      const response = await app.request("/members/register", {
        method: "POST",
        body: JSON.stringify(regDetails),
      });

      assertEquals(response.status, 409);
    });
  });

  describe("POST /members/login", () => {
    beforeEach(async () => {
      await app.request("/members/register", {
        method: "POST",
        body: JSON.stringify(regDetails),
      });
    });

    it("should fail with validation error(400) if login details are not provided", async () => {
      const response = await app.request("/members/login", {
        method: "POST",
        body: JSON.stringify({}),
      });

      assertEquals(response.status, 400);
    });

    it("should fail with validation error(400) if login details are not invalid", async () => {
      const response = await app.request("/members/login", {
        method: "POST",
        body: JSON.stringify({ email: 124, password: 123 }),
      });

      assertEquals(response.status, 400);
    });

    it("should fail with authentication error(401) if login details mismatched", async () => {
      const response = await app.request("/members/login", {
        method: "POST",
        body: JSON.stringify({ email: "abc", password: "12345" }),
      });

      assertEquals(response.status, 401);
    });

    it("should login member", async () => {
      const response = await app.request("/members/login", {
        method: "POST",
        body: JSON.stringify(loginDetails),
      });

      assertEquals(response.headers.get("set-cookie"), "memberId=1");
      assertEquals(response.status, 200);
    });
  });

  describe("GET /members/list-all", () => {
    beforeEach(async () => {
      await app.request("/admins/register", {
        method: "POST",
        body: JSON.stringify(regDetails),
      });

      await app.request("/members/register", {
        method: "POST",
        body: JSON.stringify(regDetails),
      });
    });

    it("should fail with authentication error(401) if admin id is invalid", async () => {
      const response = await app.request("/members/list-all", {
        method: "GET",
        headers: { "cookie": "adminId=2" },
      });
      assertEquals(response.status, 401);
    });

    it("should list all members details", async () => {
      const response = await app.request("/members/list-all", {
        method: "GET",
        headers: { "cookie": "adminId=1" },
      });
      assertEquals(response.status, 200);
    });
  });
});
