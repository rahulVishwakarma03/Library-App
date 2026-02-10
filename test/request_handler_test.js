import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Library } from "../src/library.js";
import { requestHandler } from "../src/request_handler.js";
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
    const response = await requestHandler(library, request);
    assertEquals(response.status, 400);
  });

  it("customer registration request", async () => {
    const request = createRequest(mockRequests.registerCustomer);
    const response = await requestHandler(library, request);
    assertEquals(response.status, 201);
  });

  it("customer login request", async () => {
    const regReq = createRequest(mockRequests.registerCustomer);
    await requestHandler(library, regReq);
    const loginReq = createRequest(mockRequests.loginCustomer);
    const response = await requestHandler(library, loginReq);
    assertEquals(response.status, 200);
  });

  it("customer login request with wrong details", async () => {
    const request = createRequest(mockRequests.invalidCustomerLoginDetails);
    const response = await requestHandler(library, request);
    assertEquals(response.status, 401);
  });

  it("admin registration request", async () => {
    const request = createRequest(mockRequests.registerAdmin);
    const response = await requestHandler(library, request);
    assertEquals(response.status, 201);
  });

  it("admin login request", async () => {
    const regReq = createRequest(mockRequests.registerAdmin);
    await requestHandler(library, regReq);
    const loginReq = createRequest(mockRequests.loginAdmin);
    const response = await requestHandler(library, loginReq);
    assertEquals(response.status, 200);
  });

  it("add book request", async () => {
    const request = createRequest(mockRequests.addBook);
    const response = await requestHandler(library, request);
    assertEquals(response.status, 201);
  });

  it("update quantity request", async () => {
    const addBookReq = createRequest(mockRequests.addBook);
    const updateReq = createRequest(mockRequests.updateQuantity);
    await requestHandler(library, addBookReq);
    const response = await requestHandler(library, updateReq);
    assertEquals(response.status, 204);
  });

  it("view book request", async () => {
    const addReq = createRequest(mockRequests.addBook);
    const viewReq = createRequest(mockRequests.viewBook);
    await requestHandler(library, addReq);
    const response = await requestHandler(library, viewReq);
    assertEquals(response.status, 200);
  });

  it("remove book request", async () => {
    const addReq = createRequest(mockRequests.addBook);
    const deleteReq = createRequest(mockRequests.removeBook);
    await requestHandler(library, addReq);
    const response = await requestHandler(library, deleteReq);
    assertEquals(response.status, 204);
  });

  it("list all books request", async () => {
    const addReq = createRequest(mockRequests.addBook);
    const listBookReq = createRequest(mockRequests.listAllBooks);
    await requestHandler(library, addReq);
    const response = await requestHandler(library, listBookReq);

    assertEquals(response.status, 200);
  });

  it("list all customers request", async () => {
    const regReq = createRequest(mockRequests.registerCustomer);
    const listCustomerReq = createRequest(mockRequests.listAllCustomers);
    await requestHandler(library, regReq);
    const response = await requestHandler(library, listCustomerReq);

    assertEquals(response.status, 200);
  });

  it("borrow book request", async () => {
    const regReq = createRequest(mockRequests.registerCustomer);
    const addReq = createRequest(mockRequests.addBook);
    const borrowBookReq = createRequest(mockRequests.borrowBook);
    await requestHandler(library, regReq);
    await requestHandler(library, addReq);
    const response = await requestHandler(library, borrowBookReq);

    assertEquals(response.status, 200);
  });

  it("list borrowed books request", async () => {
    const regReq = createRequest(mockRequests.registerCustomer);
    const addReq = createRequest(mockRequests.addBook);
    const borrowBookReq = createRequest(mockRequests.borrowBook);
    const listBorrowedReq = createRequest(mockRequests.listBorrowed);
    await requestHandler(library, regReq);
    await requestHandler(library, addReq);
    await requestHandler(library, borrowBookReq);
    const response = await requestHandler(library, listBorrowedReq);

    assertEquals(response.status, 200);
  });

  it("return book request", async () => {
    const regReq = createRequest(mockRequests.registerCustomer);
    const addReq = createRequest(mockRequests.addBook);
    const borrowBookReq = createRequest(mockRequests.borrowBook);
    const returnBookReq = createRequest(mockRequests.returnBook);
    await requestHandler(library, regReq);
    await requestHandler(library, addReq);
    await requestHandler(library, borrowBookReq);
    const response = await requestHandler(library, returnBookReq);

    assertEquals(response.status, 200);
  });
});
