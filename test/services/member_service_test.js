import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import { DatabaseSync } from "node:sqlite";
import { DbClient } from "../../src/db_client.js";
import { mockReqDetails } from "../../data/mock_requests.js";
import { AuthenticationError } from "../../src/utils/custom_errors.js";
import {
  listMembers,
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
    registrationDetails = mockReqDetails.regDetails;
    loginDetails = mockReqDetails.loginDetails;
  });

  describe("Register Member", () => {
    it("should register if input is valid", () => {
      const res = registerMember(dbClient, registrationDetails);
      assertEquals(res.success, true);
    });

    it("should throw conflict error if admin already exists with the same email", () => {
      registerMember(dbClient, registrationDetails);
      assertThrows(() => registerMember(dbClient, registrationDetails));
    });
  });

  describe("Login Member", () => {
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
      assertEquals(res.success, true);
    });
  });

  describe("list all members", () => {
    it("should list all members", () => {
      const res = listMembers(dbClient);
      assertEquals(res.success, true);
    });
  });
});
