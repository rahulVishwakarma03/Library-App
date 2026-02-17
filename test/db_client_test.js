import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { DatabaseSync } from "node:sqlite";
import { DbClient } from "../src/db_client.js";
import { mockRequests } from "../data/mock_requests.js";

describe.only("DB Client", () => {
  let dbClient;
  beforeEach(() => {
    const db = new DatabaseSync(":memory:");
    dbClient = new DbClient(db);
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
    const res = dbClient.createMember(mockRequests.registerCustomer.body);
    assertEquals(res.lastInsertRowid, 1);
  });
});
