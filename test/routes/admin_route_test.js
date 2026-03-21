import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { mockReqDetails } from "../../data/mock_requests.js";
import { DatabaseSync } from "node:sqlite";
import { DbClient } from "../../src/db_client.js";
import { createApp } from "../../src/app.js";

describe("Admin Route /admins", () => {
  let app;
  let regDetails;
  let loginDetails;
  const headers = { "content-type": "application/json" };

  beforeEach(() => {
    const db = new DatabaseSync(":memory:");
    const dbClient = new DbClient(db);
    dbClient.initializeSchema();
    const mockLogger = () => async (_, next) => await next();
    app = createApp(dbClient, mockLogger);
    regDetails = mockReqDetails.regDetails;
    loginDetails = mockReqDetails.loginDetails;
  });

  it("/admins/invalid", async () => {
    const response = await app.request("/admins/invalid");
    assertEquals(response.status, 404);
  });

  describe("POST /admins/register", () => {
    it("should fail with validation error(400) if registration details are not provided", async () => {
      const response = await app.request("/admins/register", {
        method: "POST",
        headers,
        body: JSON.stringify({}),
      });
      assertEquals(response.status, 400);
    });

    it("should fail with validation error(400) if registration details are invalid", async () => {
      const response = await app.request("/admins/register", {
        method: "POST",
        headers,
        body: JSON.stringify({ name: "", email: 124, password: 123 }),
      });

      assertEquals(response.status, 400);
    });

    it("should register admin", async () => {
      const response = await app.request("/admins/register", {
        method: "POST",
        headers,
        body: JSON.stringify(regDetails),
      });

      assertEquals(response.status, 201);
    });

    it("should fail with conflict error(409) if admin already exists", async () => {
      app.request("/admins/register", {
        method: "POST",
        headers,
        body: JSON.stringify(regDetails),
      });

      const response = await app.request("/admins/register", {
        method: "POST",
        headers,
        body: JSON.stringify(regDetails),
      });

      assertEquals(response.status, 409);
    });
  });

  describe("POST /admins/login", () => {
    beforeEach(async () => {
      await app.request("/admins/register", {
        method: "POST",
        headers,
        body: JSON.stringify(regDetails),
      });
    });

    it("should fail with validation error(400) if login details are not provided", async () => {
      const response = await app.request("/admins/login", {
        method: "POST",
        headers,
        body: JSON.stringify({}),
      });

      assertEquals(response.status, 400);
    });

    it("should fail with validation error(400) if login details are invalid", async () => {
      const response = await app.request("/admins/login", {
        method: "POST",
        headers,
        body: JSON.stringify({ email: 124, password: 123 }),
      });

      assertEquals(response.status, 400);
    });

    it("should fail with authentication error(401) if login details mismatched", async () => {
      const response = await app.request("/admins/login", {
        method: "POST",
        headers,
        body: JSON.stringify({ email: "abc@gmail.com", password: "12345" }),
      });

      assertEquals(response.status, 401);
    });

    it("should login admin", async () => {
      const response = await app.request("/admins/login", {
        method: "POST",
        headers,
        body: JSON.stringify(loginDetails),
      });

      assertEquals(response.headers.get("set-cookie"), "adminId=1");
      assertEquals(response.status, 200);
    });
  });
});
