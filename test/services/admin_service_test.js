import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import { DatabaseSync } from "node:sqlite";
import { DbClient } from "../../src/db_client.js";
import { mockRequests } from "../../data/mock_requests.js";
import { loginAdmin, registerAdmin } from "../../src/services/admin_service.js";
import {
  AuthenticationError,
  ValidationError,
} from "../../src/utils/custom_errors.js";

describe("Admin services", () => {
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

  describe("Register Admin", () => {
    it("should throw validation error if inputs are not provided", () => {
      assertThrows(
        () => registerAdmin(dbClient, {}),
        ValidationError,
        "Invalid input format",
      );
    });

    it("should throw validation error if input format is not valid", () => {
      assertThrows(
        () => registerAdmin(dbClient, { name: 2, email: "", password: "" }),
        ValidationError,
        "Invalid input format",
      );
    });

    it("should register if input is valid", () => {
      const res = registerAdmin(dbClient, registrationDetails);
      assertEquals(res.status, 201);
    });

    it("should throw conflict error if admin already exists with the same email", () => {
      registerAdmin(dbClient, registrationDetails);
      assertThrows(() => registerAdmin(dbClient, registrationDetails));
    });
  });

  describe("Login Admin", () => {
    it("should throw validation error if inputs are not provided", () => {
      assertThrows(
        () => loginAdmin(dbClient, {}),
        ValidationError,
        "Invalid input format",
      );
    });

    it("should throw validation error if input format is not valid", () => {
      assertThrows(
        () => loginAdmin(dbClient, { email: "", password: "" }),
        ValidationError,
        "Invalid input format",
      );
    });

    it("should throw authentication error if login details is wrong", () => {
      assertThrows(
        () => loginAdmin(dbClient, loginDetails),
        AuthenticationError,
        "Wrong login details",
      );
    });

    it("should login if login details is correct", () => {
      registerAdmin(dbClient, registrationDetails);
      const res = loginAdmin(dbClient, loginDetails);
      assertEquals(res.status, 200);
    });
  });
});
