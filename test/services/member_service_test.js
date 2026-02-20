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
  loginMember,
  registerMember,
} from "../../src/services/member_service.js";

describe("Member services", () => {
  let dbClient;
  let registrationDetails;
  let loginDetails;
  beforeEach(() => {
    const db = new DatabaseSync(":memory:");
    dbClient = new DbClient(db);
    dbClient.initializeSchema();
    registrationDetails = mockRequests.registerCustomer.body;
    loginDetails = mockRequests.loginCustomer.body;
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

    it("should login if login details is correct", () => {
      registerMember(dbClient, registrationDetails);
      const res = loginMember(dbClient, loginDetails);
      assertEquals(res.status, 200);
    });
  });
});
