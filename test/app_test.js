import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
// import { createRequestHandler } from "../src/app.js";
import { mockRequests } from "../data/mock_requests.js";
import { createRequest } from "../src/utils/req_res_generator.js";
import { DatabaseSync } from "node:sqlite";
import { DbClient } from "../src/db_client.js";
import { createAPP } from "../src/app.js";

describe("Request handler", () => {
  let app;
  beforeEach(() => {
    const db = new DatabaseSync(":memory:");
    const dbClient = new DbClient(db);
    dbClient.initializeSchema();
    app = createAPP(dbClient);
  });

  it("invalid request", async () => {
    const res = await app.request("/invalid");

    assertEquals(res.status, 404);
  });

  describe.only("/admin routes", () => {
    it("/admin/invalid", async () => {
      const res = await app.request("/admins/invalid");
      assertEquals(res.status, 404);
    });

    it("Post /admins/register", async () => {
      const response = await app.request("/admins/register", {
        method: "POST",
        body: JSON.stringify(mockRequests.registerAdmin.body),
      });

      assertEquals(response.status, 201);
    });

    it("Post /admins/login", async () => {
      await app.request("/admins/register", {
        method: "POST",
        body: JSON.stringify(mockRequests.registerAdmin.body),
      });

      const response = await app.request("/admins/login", {
        method: "POST",
        body: JSON.stringify(mockRequests.loginAdmin.body),
      });
      assertEquals(response.status, 200);
    });
  });

  describe("member resource", () => {
    it("members service path is invalid", async () => {
      const request = createRequest({
        url: "http://localhost:8000/members/invalid",
        method: "GET",
      });
      const res = await handleRequest(request);
      assertEquals(res.status, 404);
    });

    it("member registration request", async () => {
      const request = createRequest(mockRequests.registerMember);
      const response = await handleRequest(request);
      assertEquals(response.status, 201);
    });

    it("member login request", async () => {
      const regReq = createRequest(mockRequests.registerMember);
      await handleRequest(regReq);
      const loginReq = createRequest(mockRequests.loginMember);
      const response = await handleRequest(loginReq);
      assertEquals(response.status, 200);
    });

    it("member login request with wrong details", async () => {
      const request = createRequest(mockRequests.invalidMemberLoginDetails);
      const response = await handleRequest(request);

      assertEquals(response.status, 401);
    });

    it("list all members request", async () => {
      handleRequest(createRequest(mockRequests.registerAdmin));
      const loginReq = createRequest(mockRequests.loginAdmin);
      const res = await handleRequest(loginReq);
      const { token } = await res.json();
      const listMembersReq = createRequest(
        mockRequests.listAllMembers,
        token,
      );
      const response = await handleRequest(listMembersReq);

      assertEquals(response.status, 200);
    });
  });

  describe("book resource", () => {
    let token;
    beforeEach(async () => {
      await handleRequest(createRequest(mockRequests.registerAdmin));
      const loginReq = createRequest(mockRequests.loginAdmin);
      const res = await handleRequest(loginReq);
      const body = await res.json();
      token = body.token;
    });

    it("books service path is invalid", async () => {
      const request = createRequest({
        url: "http://localhost:8000/books/invalid",
        method: "GET",
      });
      const res = await handleRequest(request);
      assertEquals(res.status, 404);
    });

    it("add book request", async () => {
      const request = createRequest(mockRequests.addBook, token);
      const response = await handleRequest(request);

      assertEquals(response.status, 201);
    });

    it("update quantity request", async () => {
      const addBookReq = createRequest(mockRequests.addBook, token);
      const updateReq = createRequest(mockRequests.updateQuantity, token);
      await handleRequest(addBookReq);
      const response = await handleRequest(updateReq);
      assertEquals(response.status, 200);
    });

    it("remove book request", async () => {
      const addReq = createRequest(mockRequests.addBook, token);
      const deleteReq = createRequest(mockRequests.removeBook, token);
      await handleRequest(addReq);
      const response = await handleRequest(deleteReq);
      assertEquals(response.status, 200);
    });

    it("list all books request", async () => {
      const addReq = createRequest(mockRequests.addBook);
      const listBookReq = createRequest(mockRequests.listAllBooks);
      await handleRequest(addReq);
      const response = await handleRequest(listBookReq);
      assertEquals(response.status, 200);
    });
  });

  describe("borrows resource", () => {
    let token;
    beforeEach(async () => {
      const memberRegReq = createRequest(mockRequests.registerMember);
      const adminRegReq = createRequest(mockRequests.registerAdmin);
      const memberLoginReq = createRequest(mockRequests.loginMember);
      const adminLoginReq = createRequest(mockRequests.loginAdmin);
      await handleRequest(memberRegReq);
      await handleRequest(adminRegReq);
      const adminLoginRes = await handleRequest(adminLoginReq);
      const adminBody = await adminLoginRes.json();
      await handleRequest(
        createRequest(mockRequests.addBook, adminBody.token),
      );
      const res = await handleRequest(memberLoginReq);
      const body = await res.json();
      token = body.token;
    });

    it("borrows service path is invalid", async () => {
      const request = createRequest({
        url: "http://localhost:8000/borrows/invalid",
        method: "GET",
      });
      const res = await handleRequest(request);
      assertEquals(res.status, 404);
    });

    it("should fail if token is not given", async () => {
      const borrowReq = createRequest(mockRequests.borrowBook);
      const response = await handleRequest(borrowReq);
      assertEquals(response.status, 401);
    });

    it("borrow book request", async () => {
      const borrowReq = createRequest(mockRequests.borrowBook, token);
      const response = await handleRequest(borrowReq);
      assertEquals(response.status, 200);
    });

    it("return book request", async () => {
      const borrowBookReq = createRequest(mockRequests.borrowBook, token);
      const returnBookReq = createRequest(mockRequests.returnBook, token);
      await handleRequest(borrowBookReq);
      const response = await handleRequest(returnBookReq);

      assertEquals(response.status, 200);
    });

    it("list borrowed books request", async () => {
      const borrowBookReq = createRequest(mockRequests.borrowBook, token);
      const listBorrowedReq = createRequest(mockRequests.listBorrowed, token);
      await handleRequest(borrowBookReq);
      const response = await handleRequest(listBorrowedReq);
      assertEquals(response.status, 200);
    });
  });
});
