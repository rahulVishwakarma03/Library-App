import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import { Library } from "../src/library.js";
import { mockRequests } from "../data/mock_requests.js";
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../src/custom_errors.js";

describe("Library", () => {
  let library;
  let registrationDetails;
  let loginDetails;
  let bookDetails;

  beforeEach(() => {
    library = new Library({});
    registrationDetails = mockRequests.registerCustomer.body;
    loginDetails = mockRequests.loginCustomer.body;
    bookDetails = mockRequests.addBook.body;
  });

  describe("Customer Registration", () => {
    it("register customer", () => {
      const response = library.registerCustomer(registrationDetails);
      assertEquals(response.status, 201);
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
      assertEquals(library.loginCustomer(loginDetails).status, 200);
    });

    it("should fail if login details are inValid", () => {
      library.registerAdmin(registrationDetails),
        assertThrows(
          () => library.loginCustomer(loginDetails),
          AuthenticationError,
          "Wrong login credential",
        );
    });
  });

  describe("Admin registration", () => {
    it("register admin", () => {
      assertEquals(library.registerAdmin(registrationDetails).status, 201);
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
      assertEquals(library.loginAdmin(loginDetails).status, 200);
    });

    it("should fail if login details are inValid", () => {
      assertThrows(
        () => library.loginAdmin(loginDetails),
        AuthenticationError,
        "Wrong login credential",
      );
    });
  });

  describe("Add New Book", () => {
    it("should add new book if book doesn't exist", () => {
      assertEquals(library.addBook(bookDetails).status, 201);
    });

    it("should fail if book already exists", () => {
      library.addBook(bookDetails);
      assertThrows(
        () => library.addBook(bookDetails),
        ConflictError,
        "Book already exists",
      );
    });

    it("should fail if total book copies is zero", () => {
      assertThrows(
        () => library.addBook({ ...bookDetails, total: 0 }),
        ValidationError,
        "Total can not be zero",
      );
    });
  });

  describe("Update Book copies quantity", () => {
    it("should update quantity", () => {
      library.addBook(bookDetails);
      assertEquals(
        library.updateQuantity({ bookId: 1, quantity: 2 }).status,
        204,
      );
    });

    it("should fail if quantity is invalid", () => {
      library.addBook(bookDetails);
      assertThrows(
        () => library.updateQuantity({ bookId: 1, quantity: -10 }),
        ValidationError,
        "Invalid quantity",
      );

      assertThrows(
        () => library.updateQuantity({ bookId: 1, quantity: 2.4 }),
        ValidationError,
        "Invalid quantity",
      );
    });

    it("should fail if bookId is wrong", () => {
      assertThrows(
        () => library.updateQuantity({ bookId: 2 }),
        AuthenticationError,
        "Wrong bookId",
      );
    });
  });

  describe("View a Book", () => {
    it("should give a book's details if book exists", () => {
      library.addBook(bookDetails);
      assertEquals(library.viewBook({ bookId: 1 }).status, 200);
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
      assertEquals(library.removeBook({ bookId: 1 }).status, 204);
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

    it("should fail if book is borrowed", () => {
      library.registerCustomer(registrationDetails);
      library.addBook(bookDetails);
      library.borrowBook({ customerId: 1, bookId: 1 });
      assertThrows(
        () => library.removeBook({ bookId: 1 }),
        ConflictError,
        "Cannot remove the book",
      );
    });
  });

  describe("List all Books", () => {
    it("should give all books", () => {
      library.addBook(bookDetails);
      assertEquals(library.listAllBooks().status, 200);
    });

    it("should fail if book doesn't exist", () => {
      assertThrows(
        () => library.listAllBooks(),
        NotFoundError,
        "No books available",
      );
    });
  });

  describe("List all Customers", () => {
    it("should give all customers", () => {
      library.registerCustomer(registrationDetails);
      assertEquals(library.listAllCustomers().status, 200);
    });

    it("should fail if no customer available", () => {
      assertThrows(
        () => library.listAllCustomers(),
        NotFoundError,
        "No customers available",
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
        library.borrowBook({ customerId: 1, bookId: 1 }).status,
        200,
      );
    });

    it("should fail if book is not available", () => {
      library.addBook({ ...bookDetails, total: 1 });
      library.borrowBook({ customerId: 1, bookId: 1 });
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

      assertEquals(library.listBorrowed({ customerId: 1 }).status, 200);
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
        library.returnBook({ customerId: 1, bookId: 1 }).status,
        200,
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
