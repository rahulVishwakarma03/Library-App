import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import { DatabaseSync } from "node:sqlite";
import { DbClient } from "../src/db_client.js";
import { mockReqDetails } from "../data/mock_requests.js";
import { ServerError } from "../src/utils/custom_errors.js";

describe("DB Client", () => {
  let dbClient;
  let registrationDetails;
  let loginDetails;
  let bookDetails;
  beforeEach(() => {
    const db = new DatabaseSync(":memory:");
    dbClient = new DbClient(db);
    registrationDetails = mockReqDetails.regDetails;
    loginDetails = mockReqDetails.loginDetails;
    bookDetails = mockReqDetails.bookDetails;
  });

  describe("create dbClient", () => {
    it("should throw server error if db is undefined", () => {
      assertThrows(() => new DbClient(), ServerError, "db doesn't exist");
    });

    it("should create dbClient", () => {
      const db = new DatabaseSync(":memory:");
      const dbClient = new DbClient(db);
      assertEquals(typeof dbClient, "object");
    });
  });

  describe("Find Table", () => {
    it("find table", () => {
      const tables = dbClient.findTables();
      assertEquals(tables, []);
    });
  });

  describe("Schema Initialization", () => {
    it("initialize schema", () => {
      const res = dbClient.initializeSchema();
      const tables = res.map(({ name }) => name);

      assertEquals(tables.includes("members"), true);
      assertEquals(tables.includes("admins"), true);
      assertEquals(tables.includes("books"), true);
      assertEquals(tables.includes("book_transactions"), true);
    });
  });

  describe("Create a Member", () => {
    beforeEach(() => {
      dbClient.initializeSchema();
    });

    it("create member", () => {
      const res = dbClient.createMember(registrationDetails);
      assertEquals(res.lastInsertRowid, 1);
    });

    it("should throw error if member already exists", () => {
      dbClient.createMember(registrationDetails);
      assertThrows(() => dbClient.createMember(registrationDetails));
    });
  });

  describe("Find a Member", () => {
    beforeEach(() => {
      dbClient.initializeSchema();
      dbClient.createMember(registrationDetails);
    });

    it("find member by memberId if member is not present", () => {
      const member = dbClient.findMemberById({ memberId: 2 });
      assertEquals(member, undefined);
    });

    it("find member by memberId if member is present", () => {
      const member = dbClient.findMemberById({ memberId: 1 });
      assertEquals(member.email, registrationDetails.email);
    });

    it("find member by email if member is present", () => {
      const member = dbClient.findMemberByEmail({
        email: registrationDetails.email,
      });
      assertEquals(member.email, registrationDetails.email);
    });

    it("find member by email and password if member is present", () => {
      const member = dbClient.findMemberByEmailAndPassword(loginDetails);
      assertEquals(member.memberId, 1);
      assertEquals(member.email, registrationDetails.email);
      assertEquals(member.password, registrationDetails.password);
    });
  });

  describe("Create a Admin", () => {
    beforeEach(() => {
      dbClient.initializeSchema();
    });

    it("create admin", () => {
      const res = dbClient.createAdmin(registrationDetails);
      assertEquals(res.lastInsertRowid, 1);
    });

    it("should throw error if admin already exists", () => {
      dbClient.createAdmin(registrationDetails);
      assertThrows(() => dbClient.createAdmin(registrationDetails));
    });
  });

  describe("Find a admin", () => {
    beforeEach(() => {
      dbClient.initializeSchema();
      dbClient.createAdmin(registrationDetails);
    });

    it("find admin by adminId if admin is not present", () => {
      const admin = dbClient.findAdminById({ adminId: 2 });
      assertEquals(admin, undefined);
    });

    it("find admin by adminId if admin is present", () => {
      const admin = dbClient.findAdminById({ adminId: 1 });
      assertEquals(admin.email, registrationDetails.email);
    });

    it("find admin by email if admin is present", () => {
      const admin = dbClient.findAdminByEmail({
        email: registrationDetails.email,
      });
      assertEquals(admin.email, registrationDetails.email);
    });

    it("find admin by email and password if admin is present", () => {
      const admin = dbClient.findAdminByEmailAndPassword(loginDetails);
      assertEquals(admin.adminId, 1);
      assertEquals(admin.email, registrationDetails.email);
      assertEquals(admin.password, registrationDetails.password);
    });
  });

  describe("Create Book", () => {
    beforeEach(() => {
      dbClient.initializeSchema();
    });

    it("create book", () => {
      const res = dbClient.createBook(bookDetails);
      assertEquals(res.lastInsertRowid, 1);
    });

    it("should fail if total is less than or equal to zero", () => {
      assertThrows(() => dbClient.createBook({ ...bookDetails, total: 0 }));
      assertThrows(() => dbClient.createBook({ ...bookDetails, total: -3 }));
    });

    it("should throw error if book already exists", () => {
      dbClient.createBook(bookDetails);
      assertThrows(() => dbClient.createBook(bookDetails));
    });
  });

  describe("Find book", () => {
    beforeEach(() => {
      dbClient.initializeSchema();
      dbClient.createBook(bookDetails);
    });

    it("find book by bookId if book is not present", () => {
      const book = dbClient.findBookById({ bookId: 2 });
      assertEquals(book, undefined);
    });

    it("find book by bookId if book is present", () => {
      const book = dbClient.findBookById({ bookId: 1 });
      assertEquals(book.title, bookDetails.title);
      assertEquals(book.author, bookDetails.author);
    });

    it("find book by title and author", () => {
      const book = dbClient.findBookByTitleAndAuthor(bookDetails);
      assertEquals(book.title, bookDetails.title);
      assertEquals(book.author, bookDetails.author);
    });
  });

  describe("Delete Book", () => {
    beforeEach(() => {
      dbClient.initializeSchema();
      dbClient.createBook(bookDetails);
    });

    it("delete a book", () => {
      const res = dbClient.deleteBook({ bookId: 1 });
      assertEquals(res.changes, 1);
    });

    it("shouldn't delete a book if book doesn't exist", () => {
      const res = dbClient.deleteBook({ bookId: 2 });
      assertEquals(res.changes, 0);
    });
  });

  describe("Update book quantity", () => {
    beforeEach(() => {
      dbClient.initializeSchema();
      dbClient.createBook(bookDetails);
    });

    it("update quantity of a book", () => {
      const res = dbClient.updateBookQuantity({ bookId: 1, quantity: 10 });
      assertEquals(res.changes, 1);
      assertEquals(dbClient.findBookById({ bookId: 1 }).total, 10);
    });

    it("shouldn't update the quantity of a book if quantity is less than or equal to zero", () => {
      assertThrows(() =>
        dbClient.updateBookQuantity({ bookId: 1, quantity: 0 })
      );
      assertEquals(dbClient.findBookById({ bookId: 1 }).total, 5);
    });

    it("shouldn't update the quantity of a book if book doesn't exists", () => {
      const res = dbClient.updateBookQuantity({ bookId: 2, quantity: 10 });
      assertEquals(res.changes, 0);
    });
  });

  describe("Borrow a Book", () => {
    beforeEach(() => {
      dbClient.initializeSchema();
      dbClient.createBook(bookDetails);
      dbClient.createMember(registrationDetails);
    });

    it("borrow a book", () => {
      assertEquals(dbClient.findBookById({ bookId: 1 }).borrowed, 0);

      const res = dbClient.borrowBook({ bookId: 1, memberId: 1 });
      assertEquals(dbClient.findBookById({ bookId: 1 }).borrowed, 1);
      assertEquals(res.lastInsertRowid, 1);
    });

    it("should rollback if memberId is wrong", () => {
      assertEquals(dbClient.findBookById({ bookId: 1 }).borrowed, 0);
      const res = dbClient.borrowBook({ bookId: 1, memberId: 2 });
      assertEquals(dbClient.findBookById({ bookId: 1 }).borrowed, 0);
      assertEquals(res, {});
    });

    it("should rollback if bookId is wrong", () => {
      assertEquals(dbClient.findBookById({ bookId: 1 }).borrowed, 0);
      const res = dbClient.borrowBook({ bookId: 2, memberId: 1 });
      assertEquals(dbClient.findBookById({ bookId: 1 }).borrowed, 0);
      assertEquals(res, {});
    });
  });

  describe("Find borrowed book by memberId", () => {
    beforeEach(() => {
      dbClient.initializeSchema();
      dbClient.createBook(bookDetails);
      dbClient.createMember(registrationDetails);
      dbClient.borrowBook({ bookId: 1, memberId: 1 });
    });

    it("Find borrowed books if book is borrowed but not returned", () => {
      const res = dbClient.findBorrowedBooksByMemberId({ memberId: 1 });
      assertEquals(res[0].bookId, 1);
    });

    it("Find borrowed books if book is borrowed but also returned", () => {
      const returned = dbClient.returnBook({ transactionId: 1 });
      console.log({ returned });
      const res = dbClient.findBorrowedBooksByMemberId({ memberId: 1 });
      assertEquals(res, []);
    });
  });

  describe("Return a Book", () => {
    beforeEach(() => {
      dbClient.initializeSchema();
      dbClient.createBook(bookDetails);
      dbClient.createMember(registrationDetails);
      dbClient.borrowBook({ bookId: 1, memberId: 1 });
    });

    it("return a book", () => {
      assertEquals(dbClient.findBookById({ bookId: 1 }).borrowed, 1);
      const res = dbClient.returnBook({ transactionId: 1 });
      assertEquals(dbClient.findBookById({ bookId: 1 }).borrowed, 0);
      assertEquals(res.changes, 1);
    });
  });
});
