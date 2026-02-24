import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import { DatabaseSync } from "node:sqlite";
import { DbClient } from "../../src/db_client.js";
import { mockRequests } from "../../data/mock_requests.js";
import {
  AuthenticationError,
  ValidationError,
} from "../../src/utils/custom_errors.js";
import {
  listMembers,
  loginMember,
  registerMember,
} from "../../src/services/member_service.js";
import { loginAdmin, registerAdmin } from "../../src/services/admin_service.js";

describe("Member services", () => {
  let dbClient;
  let registrationDetails;
  let loginDetails;
  beforeEach(() => {
    const db = new DatabaseSync(":memory:");
    dbClient = new DbClient(db);
    dbClient.initializeSchema();
    registrationDetails = mockRequests.registerMember.body;
    loginDetails = mockRequests.loginMember.body;
  });

  describe("Register Member", () => {
    it("should throw validation error if inputs are not provided", () => {
      assertThrows(
        () => registerMember(dbClient, {}),
        ValidationError,
        "Invalid input format",
      );
    });

    it("should throw validation error if input format is not valid", () => {
      assertThrows(
        () => registerMember(dbClient, { name: 2, email: "", password: "" }),
        ValidationError,
        "Invalid input format",
      );
    });

    it("should register if input is valid", () => {
      const res = registerMember(dbClient, registrationDetails);
      assertEquals(res.status, 201);
    });

    it("should throw conflict error if admin already exists with the same email", () => {
      registerMember(dbClient, registrationDetails);
      assertThrows(() => registerMember(dbClient, registrationDetails));
    });
  });

  describe("Login Member", () => {
    it("should throw validation error if inputs are not provided", () => {
      assertThrows(
        () => loginMember(dbClient, {}),
        ValidationError,
        "Invalid input format",
      );
    });

    it("should throw validation error if input format is not valid", () => {
      assertThrows(
        () => loginMember(dbClient, { email: "", password: "" }),
        ValidationError,
        "Invalid input format",
      );
    });

    it("should throw authentication error if login details is wrong", () => {
      assertThrows(
        () => loginMember(dbClient, loginDetails),
        AuthenticationError,
        "Wrong login details",
      );
    });

    it("should login if login details is correct", async () => {
      registerMember(dbClient, registrationDetails);
      const res = loginMember(dbClient, loginDetails);
      const body = await res.json();
      assertEquals(body.success, true);
    });
  });

  describe("list all members", () => {
    it("should throw error if token doesn't match", () => {
      const req = new Request("http://localhost:8000/members/list", {
        method: "GET",
        headers: {
          authorization: "Bearer 1234",
        },
      });

      assertThrows(
        () => listMembers(dbClient, req),
        AuthenticationError,
        "Unauthorized!",
      );
    });

    it("should list all members", async () => {
      registerAdmin(dbClient, registrationDetails);
      const loginRes = loginAdmin(dbClient, loginDetails);
      const loginBody = await loginRes.json();
      const req = new Request("http://localhost:8000/members/list", {
        method: "GET",
        headers: {
          authorization: `Bearer ${loginBody.token}`,
        },
      });
      const res = listMembers(dbClient, req);
      const body = await res.json();
      assertEquals(body.success, true);
    });
  });
});
