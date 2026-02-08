import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import { Library } from "../src/library.js";
import { mockRequests } from "../data/mock_requests.js";
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from "../src/custom_errors.js";

describe("Library", () => {
  let library;
  let registrationDetails;
  let loginDetails;
  let bookDetails;

  beforeEach(() => {
    library = new Library({});
    registrationDetails = mockRequests.registerCustomer.data;
    loginDetails = mockRequests.loginCustomer.data;
    bookDetails = mockRequests.addBook.data;
  });

  describe("Customer Registration", () => {
    it("register customer", () => {
      assertEquals(
        library.registerCustomer(registrationDetails),
        { success: true, status: 201 },
      );
    });

    it("shouldn't register customer if it's already registered", () => {
      library.registerCustomer(registrationDetails);
      assertThrows(
        () => library.registerCustomer(registrationDetails),
        ConflictError,
        "Customer already exists",
      );
    });
  });

  describe("Customer Login", () => {
    it("should login if login details are valid", () => {
      library.registerCustomer(registrationDetails);
      assertEquals(
        library.loginCustomer(loginDetails),
        { success: true, status: 200, data: { customerId: 1 } },
      );
    });

    it("should fail if login details are inValid", () => {
      library.registerAdmin(registrationDetails),
        assertThrows(
          () => library.loginCustomer(loginDetails),
          AuthenticationError,
          "Customer login credential is wrong",
        );
    });
  });

  describe("Admin registration", () => {
    it("register admin", () => {
      assertEquals(
        library.registerAdmin(registrationDetails),
        { success: true, status: 201 },
      );
    });

    it("shouldn't register admin if it's already registered", () => {
      library.registerAdmin(registrationDetails),
        assertThrows(
          () => library.registerAdmin(registrationDetails),
          ConflictError,
          "Admin already exists",
        );
    });
  });

  describe("Admin login", () => {
    it("should login if login details are valid", () => {
      library.registerAdmin(registrationDetails);
      assertEquals(
        library.loginAdmin(loginDetails),
        { success: true, status: 200, data: { adminId: 1 } },
      );
    });

    it("should fail if login details are inValid", () => {
      assertThrows(
        () => library.loginAdmin(loginDetails),
        AuthenticationError,
        "Admin login credential is wrong",
      );
    });
  });

  describe("Add New Book", () => {
    it("should add new book if book doesn't exist", () => {
      assertEquals(
        library.addBook(bookDetails),
        { success: true, status: 201, data: { bookId: 1 } },
      );
    });

    it("should fail if book already exists", () => {
      library.addBook(bookDetails);
      assertThrows(
        () => library.addBook(bookDetails),
        ConflictError,
        "Book already exists",
      );
    });
  });

  describe("View a Book", () => {
    it("should give a book's details if book exists", () => {
      library.addBook(bookDetails);
      assertEquals(
        library.viewBook({ bookId: 1 }),
        {
          success: true,
          status: 200,
          data: { ...bookDetails, bookId: 1, available: bookDetails.total },
        },
      );
    });

    it("should fail if book doesn't exist", () => {
      assertThrows(
        () => library.viewBook({ bookId: 1 }),
        NotFoundError,
        "Book not found",
      );
    });
  });

  describe("Remove a Book", () => {
    it("should remove a book's details if book exists", () => {
      library.addBook(bookDetails);
      assertEquals(
        library.removeBook({ bookId: 1 }),
        {
          success: true,
          status: 204,
        },
      );
      assertThrows(
        () => library.viewBook({ bookId: 1 }),
        NotFoundError,
        "Book not found",
      );
    });

    it("should fail if book doesn't exist", () => {
      assertThrows(
        () => library.removeBook({ bookId: 1 }),
        AuthenticationError,
        "Wrong bookId",
      );
    });
  });

  describe("List all Books", () => {
    it("should give all books", () => {
      library.addBook(bookDetails);
      assertEquals(
        library.listAllBooks(),
        {
          success: true,
          status: 200,
          data: [{ ...bookDetails, bookId: 1, available: bookDetails.total }],
        },
      );
    });

    it("should fail if book doesn't exist", () => {
      assertThrows(
        () => library.listAllBooks(),
        NotFoundError,
        "No books available",
      );
    });
  });

  describe("Borrow Books", () => {
    beforeEach(() => {
      library.registerCustomer(registrationDetails);
    });

    it("should borrow book if book is available and given details are valid", () => {
      library.addBook(bookDetails);
      assertEquals(
        library.borrowBook({ customerId: 1, bookId: 1 }),
        { success: true, status: 204 },
      );
    });

    it("should fail if book is not available", () => {
      library.addBook({ ...bookDetails, total: 0 });
      assertThrows(
        () => library.borrowBook({ customerId: 1, bookId: 1 }),
        ConflictError,
        "Insufficient book copies",
      );
    });

    it("should fail if customer details is invalid", () => {
      library.addBook(bookDetails);
      assertThrows(
        () => library.borrowBook({ customerId: 5, bookId: 1 }),
        AuthenticationError,
        "Wrong customerId or bookId",
      );
    });

    it("should fail if book details is invalid", () => {
      library.addBook(bookDetails);
      assertThrows(
        () => library.borrowBook({ customerId: 1, bookId: 4 }),
        AuthenticationError,
        "Wrong customerId or bookId",
      );
    });
  });

  describe("List borrowed Books", () => {
    beforeEach(() => {
      library.registerCustomer(registrationDetails);
      library.addBook(bookDetails);
    });

    it("should list borrowed books by a customer", () => {
      library.borrowBook({ customerId: 1, bookId: 1 });

      assertEquals(
        library.listBorrowed({ customerId: 1 }),
        {
          success: true,
          status: 200,
          data: [{
            title: bookDetails.title,
            author: bookDetails.author,
            bookId: 1,
          }],
        },
      );
    });

    it("should fail if customer details is invalid", () => {
      assertThrows(
        () => library.listBorrowed({ customerId: 5 }),
        AuthenticationError,
        "Wrong customerId",
      );
    });

    it("should fail if book doesn't exist", () => {
      assertThrows(
        () => library.listBorrowed({ customerId: 1 }),
        NotFoundError,
        "No book borrowed",
      );
    });
  });

  describe("return a borrowed Book", () => {
    beforeEach(() => {
      library.registerCustomer(registrationDetails);
      library.addBook(bookDetails);
      library.borrowBook({ customerId: 1, bookId: 1 });
    });

    it("should return a borrowed book by a customer", () => {
      assertEquals(
        library.returnBook({ customerId: 1, bookId: 1 }),
        {
          success: true,
          status: 204,
        },
      );
    });

    it("should fail if customer details is invalid", () => {
      assertThrows(
        () => library.returnBook({ customerId: 5, bookId: 1 }),
        AuthenticationError,
        "Wrong customerId",
      );
    });

    it("should fail if book details is invalid", () => {
      assertThrows(
        () => library.returnBook({ customerId: 1, bookId: 2 }),
        AuthenticationError,
        "Wrong bookId",
      );
    });
  });
});
