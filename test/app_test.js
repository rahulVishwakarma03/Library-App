import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { mockReqDetails } from "../data/mock_requests.js";
import { createRequest } from "../src/utils/req_res_generator.js";
import { DatabaseSync } from "node:sqlite";
import { DbClient } from "../src/db_client.js";
import { createAPP } from "../src/app.js";

describe.ignore("App test", () => {
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

  describe("/admin routes", () => {
    it("/admins/invalid", async () => {
      const res = await app.request("/admins/invalid");
      assertEquals(res.status, 404);
    });

    it("POST /admins/register", async () => {
      const response = await app.request("/admins/register", {
        method: "POST",
        body: JSON.stringify(mockReqDetails.registerAdmin.body),
      });

      assertEquals(response.status, 201);
    });

    it("POST /admins/register if admin already exists", async () => {
      app.request("/admins/register", {
        method: "POST",
        body: JSON.stringify(mockReqDetails.registerAdmin.body),
      });

      const response = await app.request("/admins/register", {
        method: "POST",
        body: JSON.stringify(mockReqDetails.registerAdmin.body),
      });

      assertEquals(response.status, 409);
    });

    it("POST /admins/login", async () => {
      await app.request("/admins/register", {
        method: "POST",
        body: JSON.stringify(mockReqDetails.registerAdmin.body),
      });

      const response = await app.request("/admins/login", {
        method: "POST",
        body: JSON.stringify(mockReqDetails.loginAdmin.body),
      });

      assertEquals(response.headers.get("set-cookie"), "adminId=1");
      assertEquals(response.status, 200);
    });
  });

  describe("member resource", () => {
    it("/members/invalid", async () => {
      const res = await app.request("/members/invalid");
      assertEquals(res.status, 404);
    });

    it("POST /members/register", async () => {
      const response = await app.request("/members/register", {
        method: "POST",
        body: JSON.stringify(mockReqDetails.registerMember.body),
      });
      assertEquals(response.status, 201);
    });

    it.only("POST /members/register if already exists", async () => {
      await app.request("/members/register", {
        method: "POST",
        body: JSON.stringify(mockReqDetails.registerMember.body),
      });

      const response = await app.request("/members/register", {
        method: "POST",
        body: JSON.stringify(mockReqDetails.registerMember.body),
      });
      assertEquals(response.status, 409);
    });

    it("POST /members/login", async () => {
      await app.request("/members/register", {
        method: "POST",
        body: JSON.stringify(mockReqDetails.registerMember.body),
      });

      const response = await app.request("/members/login", {
        method: "POST",
        body: JSON.stringify(mockReqDetails.loginMember.body),
      });

      assertEquals(response.headers.get("set-cookie"), "memberId=1");
      assertEquals(response.status, 200);
    });

    it("POST /members/login  with wrong details", async () => {
      const response = await app.request("/members/login", {
        method: "POST",
        body: JSON.stringify(mockReqDetails.loginMember.body),
      });

      assertEquals(response.status, 401);
    });

    it.only("list all members request", async () => {
      await app.request("/admins/register", {
        method: "POST",
        body: JSON.stringify(mockReqDetails.registerAdmin.body),
      });

      await app.request("/members/register", {
        method: "POST",
        body: JSON.stringify(mockReqDetails.registerMember.body),
      });

      const response = await app.request("/members/list-all", {
        method: "GET",
        headers: { "cookie": "adminId=1" },
      });
      const body = await response.json();
      assertEquals(body.success, true);
    });
  });

  describe("book resource", () => {
    let token;
    beforeEach(async () => {
      await handleRequest(createRequest(mockReqDetails.registerAdmin));
      const loginReq = createRequest(mockReqDetails.loginAdmin);
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
      const request = createRequest(mockReqDetails.addBook, token);
      const response = await handleRequest(request);

      assertEquals(response.status, 201);
    });

    it("update quantity request", async () => {
      const addBookReq = createRequest(mockReqDetails.addBook, token);
      const updateReq = createRequest(mockReqDetails.updateQuantity, token);
      await handleRequest(addBookReq);
      const response = await handleRequest(updateReq);
      assertEquals(response.status, 200);
    });

    it("remove book request", async () => {
      const addReq = createRequest(mockReqDetails.addBook, token);
      const deleteReq = createRequest(mockReqDetails.removeBook, token);
      await handleRequest(addReq);
      const response = await handleRequest(deleteReq);
      assertEquals(response.status, 200);
    });

    it("list all books request", async () => {
      const addReq = createRequest(mockReqDetails.addBook);
      const listBookReq = createRequest(mockReqDetails.listAllBooks);
      await handleRequest(addReq);
      const response = await handleRequest(listBookReq);
      assertEquals(response.status, 200);
    });
  });

  describe("borrows resource", () => {
    let token;
    beforeEach(async () => {
      const memberRegReq = createRequest(mockReqDetails.registerMember);
      const adminRegReq = createRequest(mockReqDetails.registerAdmin);
      const memberLoginReq = createRequest(mockReqDetails.loginMember);
      const adminLoginReq = createRequest(mockReqDetails.loginAdmin);
      await handleRequest(memberRegReq);
      await handleRequest(adminRegReq);
      const adminLoginRes = await handleRequest(adminLoginReq);
      const adminBody = await adminLoginRes.json();
      await handleRequest(
        createRequest(mockReqDetails.addBook, adminBody.token),
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
      const borrowReq = createRequest(mockReqDetails.borrowBook);
      const response = await handleRequest(borrowReq);
      assertEquals(response.status, 401);
    });

    it("borrow book request", async () => {
      const borrowReq = createRequest(mockReqDetails.borrowBook, token);
      const response = await handleRequest(borrowReq);
      assertEquals(response.status, 200);
    });

    it("return book request", async () => {
      const borrowBookReq = createRequest(mockReqDetails.borrowBook, token);
      const returnBookReq = createRequest(mockReqDetails.returnBook, token);
      await handleRequest(borrowBookReq);
      const response = await handleRequest(returnBookReq);

      assertEquals(response.status, 200);
    });

    it("list borrowed books request", async () => {
      const borrowBookReq = createRequest(mockReqDetails.borrowBook, token);
      const listBorrowedReq = createRequest(mockReqDetails.listBorrowed, token);
      await handleRequest(borrowBookReq);
      const response = await handleRequest(listBorrowedReq);
      assertEquals(response.status, 200);
    });
  });
});
