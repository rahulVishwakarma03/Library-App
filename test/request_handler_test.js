import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Library } from "../src/library.js";
import { handleRequest } from "../src/request_handlers.js";
import { mockRequests } from "../data/mock_requests.js";

describe("Library Manager", () => {
  let library;

  beforeEach(() => {
    library = new Library({});
  });

  it("customer registration request", () => {
    assertEquals(
      handleRequest(library, mockRequests.registerCustomer),
      { success: true },
    );
  });

  it("customer login request", () => {
    assertEquals(
      handleRequest(library, mockRequests.loginCustomer),
      { success: false, errorCode: 402 },
    );
  });

  it("admin registration request", () => {
    assertEquals(
      handleRequest(library, mockRequests.registerAdmin),
      { success: true },
    );
  });

  it("admin login request", () => {
    assertEquals(
      handleRequest(library, mockRequests.loginAdmin),
      { success: false, errorCode: 402 },
    );
  });

  it("add book request", () => {
    assertEquals(
      handleRequest(library, mockRequests.addBook),
      { success: true },
    );
  });

  it("view book request", () => {
    handleRequest(library, mockRequests.addBook);

    assertEquals(
      handleRequest(library, mockRequests.viewBook),
      {
        success: true,
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
        data: {
          ...mockRequests.addBook.data,
          bookId: 1,
          available: mockRequests.addBook.data.total,
        },
      },
    );
  });

  it("list all books request", () => {
    handleRequest(library, mockRequests.addBook);

    assertEquals(
      handleRequest(library, mockRequests.listAllBooks),
      {
        success: true,
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
        data: {
          title: mockRequests.addBook.data.title,
          author: mockRequests.addBook.data.author,
          bookId: 1,
        },
      },
    );
  });
});
