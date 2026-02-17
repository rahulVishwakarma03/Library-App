import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { DatabaseSync } from "node:sqlite";
import { DbClient } from "../src/db_client.js";
import { mockRequests } from "../data/mock_requests.js";

describe.only("DB Client", () => {
  let dbClient;
  let registrationDetails;
  let loginDetails;
  let bookDetails;
  beforeEach(() => {
    const db = new DatabaseSync(":memory:");
    dbClient = new DbClient(db);
    registrationDetails = mockRequests.registerCustomer.body;
    loginDetails = mockRequests.loginCustomer.body;
    bookDetails = mockRequests.addBook.body;
  });

  it("find table", () => {
    const tables = dbClient.findTables();
    assertEquals(tables, []);
  });

  it("initialize schema", () => {
    const res = dbClient.initializeSchema();
    const tables = res.map(({ name }) => name);

    assertEquals(tables.includes("members"), true);
    assertEquals(tables.includes("admins"), true);
    assertEquals(tables.includes("books"), true);
    assertEquals(tables.includes("borrows"), true);
  });

  it("create member", () => {
    dbClient.initializeSchema();
    const res = dbClient.createMember(registrationDetails);
    assertEquals(res.lastInsertRowid, 1);
  });

  it("find member by memberId if member is not present", () => {
    dbClient.initializeSchema();
    const member = dbClient.findMemberById({ memberId: 1 });
    assertEquals(member, undefined);
  });

  it("find member by memberId if member is present", () => {
    dbClient.initializeSchema();
    dbClient.createMember(registrationDetails);
    const member = dbClient.findMemberById({ memberId: 1 });
    assertEquals(member.email, registrationDetails.email);
  });

  it("find member by email if member is present", () => {
    dbClient.initializeSchema();
    dbClient.createMember(registrationDetails);
    const member = dbClient.findMemberByEmail({
      email: registrationDetails.email,
    });
    assertEquals(member.email, registrationDetails.email);
  });

  it("create admin", () => {
    dbClient.initializeSchema();
    const res = dbClient.createAdmin(registrationDetails);
    assertEquals(res.lastInsertRowid, 1);
  });

  it("find admin by adminId if admin is not present", () => {
    dbClient.initializeSchema();
    const admin = dbClient.findAdminById({ adminId: 1 });
    assertEquals(admin, undefined);
  });

  it("find admin by adminId if admin is present", () => {
    dbClient.initializeSchema();
    dbClient.createAdmin(registrationDetails);
    const admin = dbClient.findAdminById({ adminId: 1 });
    assertEquals(admin.email, registrationDetails.email);
  });

  it("find admin by email if admin is present", () => {
    dbClient.initializeSchema();
    dbClient.createAdmin(registrationDetails);
    const admin = dbClient.findAdminByEmail({
      email: registrationDetails.email,
    });
    assertEquals(admin.email, registrationDetails.email);
  });
});
