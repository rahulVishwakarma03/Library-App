import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Library } from "../src/library.js";
import { handleRequest } from "../src/request_handlers.js";
import { mockRequests } from "../data/mock_requests.js";

describe("Request handler", () => {
  let library;

  beforeEach(() => {
    library = new Library({});
  });

  it("failing customer registration request", () => {
    handleRequest(library, mockRequests.registerCustomer);
    const response = handleRequest(library, mockRequests.registerCustomer);
    assertEquals(response.success, false);
    assertEquals(response.status, 409);
  });

  it("customer registration request", () => {
    assertEquals(
      handleRequest(library, mockRequests.registerCustomer),
      { success: true, status: 201 },
    );
  });

  it("customer login request", () => {
    handleRequest(library, mockRequests.registerCustomer),
      assertEquals(
        handleRequest(library, mockRequests.loginCustomer),
        { success: true, status: 200, data: { customerId: 1 } },
      );
  });

  it("admin registration request", () => {
    assertEquals(
      handleRequest(library, mockRequests.registerAdmin),
      { success: true, status: 201 },
    );
  });

  it("admin login request", () => {
    handleRequest(library, mockRequests.registerAdmin),
      assertEquals(
        handleRequest(library, mockRequests.loginAdmin),
        { success: true, status: 200, data: { adminId: 1 } },
      );
  });

  it("add book request", () => {
    assertEquals(
      handleRequest(library, mockRequests.addBook),
      { success: true, status: 201, data: { bookId: 1 } },
    );
  });

  it("view book request", () => {
    handleRequest(library, mockRequests.addBook);

    assertEquals(
      handleRequest(library, mockRequests.viewBook),
      {
        success: true,
        status: 200,
        data: {
          ...mockRequests.addBook.data,
          bookId: 1,
          available: mockRequests.addBook.data.total,
        },
      },
    );
  });

  it("remove book request", () => {
    handleRequest(library, mockRequests.addBook);

    assertEquals(
      handleRequest(library, mockRequests.removeBook),
      {
        success: true,
        status: 204,
      },
    );
  });

  it("list all books request", () => {
    handleRequest(library, mockRequests.addBook);

    assertEquals(
      handleRequest(library, mockRequests.listAllBooks),
      {
        success: true,
        status: 200,
        data: [{
          ...mockRequests.addBook.data,
          bookId: 1,
          available: mockRequests.addBook.data.total,
        }],
      },
    );
  });

  it("borrow book request", () => {
    handleRequest(library, mockRequests.registerCustomer);
    handleRequest(library, mockRequests.addBook);

    assertEquals(
      handleRequest(library, mockRequests.borrowBook),
      {
        success: true,
        status: 204,
      },
    );
  });

  it("list borrowed books request", () => {
    handleRequest(library, mockRequests.registerCustomer);
    handleRequest(library, mockRequests.addBook);
    handleRequest(library, mockRequests.borrowBook);

    assertEquals(
      handleRequest(library, mockRequests.listBorrowed),
      {
        success: true,
        status: 200,
        data: [{
          title: mockRequests.addBook.data.title,
          author: mockRequests.addBook.data.author,
          bookId: 1,
        }],
      },
    );
  });

  it("return book request", () => {
    handleRequest(library, mockRequests.registerCustomer);
    handleRequest(library, mockRequests.addBook);
    handleRequest(library, mockRequests.borrowBook);

    assertEquals(
      handleRequest(library, mockRequests.returnBook),
      {
        success: true,
        status: 204,
      },
    );
  });
});
