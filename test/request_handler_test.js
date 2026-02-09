import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Library } from "../src/library.js";
import { handleRequest } from "../src/request_handler.js";
import { mockRequests } from "../data/mock_requests.js";

const createRequest = ({ url, method, body }) => {
  return new Request(url, {
    method,
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
  });
};

describe("Request handler", () => {
  let library;

  beforeEach(() => {
    library = new Library({});
  });

  it("invalid request", async () => {
    const request = createRequest({
      url: "http://localhost:8000/invalid",
      method: "GET",
    });
    const response = await handleRequest(library, request);
    assertEquals(response.status, 400);
  });

  it("customer registration request", async () => {
    const request = createRequest(mockRequests.registerCustomer);
    const response = await handleRequest(library, request);
    assertEquals(response.status, 201);
  });

  it("customer login request", async () => {
    const regReq = createRequest(mockRequests.registerCustomer);
    await handleRequest(library, regReq);
    const loginReq = createRequest(mockRequests.loginCustomer);
    const response = await handleRequest(library, loginReq);
    assertEquals(response.status, 200);
  });

  it("customer login request with wrong details", async () => {
    const request = createRequest(mockRequests.invalidCustomerLoginDetails);
    const response = await handleRequest(library, request);
    assertEquals(response.status, 401);
  });

  it("admin registration request", async () => {
    const request = createRequest(mockRequests.registerAdmin);
    const response = await handleRequest(library, request);
    assertEquals(response.status, 201);
  });

  it("admin login request", async () => {
    const regReq = createRequest(mockRequests.registerAdmin);
    await handleRequest(library, regReq);
    const loginReq = createRequest(mockRequests.loginAdmin);
    const response = await handleRequest(library, loginReq);
    assertEquals(response.status, 200);
  });

  it("add book request", async () => {
    const request = createRequest(mockRequests.addBook);
    const response = await handleRequest(library, request);
    assertEquals(response.status, 201);
  });

  it("view book request", async () => {
    const addReq = createRequest(mockRequests.addBook);
    const viewReq = createRequest(mockRequests.viewBook);
    await handleRequest(library, addReq);
    const response = await handleRequest(library, viewReq);
    assertEquals(response.status, 200);
  });

  it("remove book request", async () => {
    const addReq = createRequest(mockRequests.addBook);
    const deleteReq = createRequest(mockRequests.removeBook);
    await handleRequest(library, addReq);
    const response = await handleRequest(library, deleteReq);
    assertEquals(response.status, 204);
  });

  it("list all books request", async () => {
    const addReq = createRequest(mockRequests.addBook);
    const listBookReq = createRequest(mockRequests.listAllBooks);
    await handleRequest(library, addReq);
    const response = await handleRequest(library, listBookReq);

    assertEquals(response.status, 200);
  });

  it("list all customers request", async () => {
    const regReq = createRequest(mockRequests.registerCustomer);
    const listCustomerReq = createRequest(mockRequests.listAllCustomers);
    await handleRequest(library, regReq);
    const response = await handleRequest(library, listCustomerReq);

    assertEquals(response.status, 200);
  });

  it("borrow book request", async () => {
    const regReq = createRequest(mockRequests.registerCustomer);
    const addReq = createRequest(mockRequests.addBook);
    const borrowBookReq = createRequest(mockRequests.borrowBook);
    await handleRequest(library, regReq);
    await handleRequest(library, addReq);
    const response = await handleRequest(library, borrowBookReq);

    assertEquals(response.status, 200);
  });

  it("list borrowed books request", async () => {
    const regReq = createRequest(mockRequests.registerCustomer);
    const addReq = createRequest(mockRequests.addBook);
    const borrowBookReq = createRequest(mockRequests.borrowBook);
    const listBorrowedReq = createRequest(mockRequests.listBorrowed);
    await handleRequest(library, regReq);
    await handleRequest(library, addReq);
    await handleRequest(library, borrowBookReq);
    const response = await handleRequest(library, listBorrowedReq);

    assertEquals(response.status, 200);
  });

  it("return book request", async () => {
    const regReq = createRequest(mockRequests.registerCustomer);
    const addReq = createRequest(mockRequests.addBook);
    const borrowBookReq = createRequest(mockRequests.borrowBook);
    const returnBookReq = createRequest(mockRequests.returnBook);
    await handleRequest(library, regReq);
    await handleRequest(library, addReq);
    await handleRequest(library, borrowBookReq);
    const response = await handleRequest(library, returnBookReq);

    assertEquals(response.status, 200);
  });
});
