import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Library } from "../src/library.js";
import { mockRequests } from "../data/mock_requests.js";

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
        { success: true },
      );
    });

    it("shouldn't register customer if it's already registered", () => {
      library.registerCustomer(registrationDetails);
      assertEquals(
        library.registerCustomer(registrationDetails),
        { success: false, errorCode: 401 },
      );
    });
  });

  describe("Customer Login", () => {
    it("should login if login details are valid", () => {
      library.registerCustomer(registrationDetails);
      assertEquals(
        library.loginCustomer(loginDetails),
        { success: true, data: { customerId: 1 } },
      );
    });

    it("should fail if login details are inValid", () => {
      assertEquals(
        library.loginCustomer(loginDetails),
        { success: false, errorCode: 402 },
      );
    });
  });

  describe("Admin registration", () => {
    it("register admin", () => {
      assertEquals(
        library.registerAdmin(registrationDetails),
        { success: true },
      );
    });

    it("shouldn't register admin if it's already registered", () => {
      library.registerAdmin(registrationDetails),
        assertEquals(
          library.registerAdmin(registrationDetails),
          { success: false, errorCode: 401 },
        );
    });
  });

  describe("Admin login", () => {
    it("should login if login details are valid", () => {
      library.registerAdmin(registrationDetails);
      assertEquals(
        library.loginAdmin(loginDetails),
        { success: true, data: { email: loginDetails.email } },
      );
    });

    it("should fail if login details are inValid", () => {
      assertEquals(
        library.loginAdmin(loginDetails),
        { success: false, errorCode: 402 },
      );
    });
  });

  describe("Add New Book", () => {
    it("should add new book if book doesn't exist", () => {
      assertEquals(
        library.addBook(bookDetails),
        { success: true },
      );
    });

    it("should fail if book already exists", () => {
      library.addBook(bookDetails);
      assertEquals(
        library.addBook(bookDetails),
        { success: false, errorCode: 401 },
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
          data: { ...bookDetails, bookId: 1, available: bookDetails.total },
        },
      );
    });

    it("should fail if book doesn't exist", () => {
      assertEquals(
        library.viewBook({ bookId: 1 }),
        { success: false, errorCode: 402 },
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
          data: { ...bookDetails, bookId: 1, available: bookDetails.total },
        },
      );
      assertEquals(library.viewBook({ bookId: 1 }), {
        success: false,
        errorCode: 402,
      });
    });

    it("should fail if book doesn't exist", () => {
      assertEquals(
        library.removeBook({ bookId: 1 }),
        { success: false, errorCode: 402 },
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
          data: [{ ...bookDetails, bookId: 1, available: bookDetails.total }],
        },
      );
    });

    it("should fail if book doesn't exist", () => {
      assertEquals(
        library.listAllBooks(),
        { success: false, errorCode: 404 },
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
        { success: true },
      );
    });

    it("should fail if book is not available", () => {
      library.addBook({ ...bookDetails, total: 0 });
      assertEquals(
        library.borrowBook({ customerId: 1, bookId: 1 }),
        { success: false, errorCode: 403 },
      );
    });

    it("should fail if customer details is invalid", () => {
      assertEquals(
        library.borrowBook({ customerId: 5 }),
        { success: false, errorCode: 402 },
      );
    });

    it("should fail if book details is invalid", () => {
      library.addBook(bookDetails);
      assertEquals(
        library.borrowBook({ customerId: 1, bookId: 4 }),
        { success: false, errorCode: 402 },
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
          data: [{
            title: bookDetails.title,
            author: bookDetails.author,
            bookId: 1,
          }],
        },
      );
    });

    it("should fail if customer details is invalid", () => {
      assertEquals(
        library.listBorrowed({ customerId: 5 }),
        { success: false, errorCode: 402 },
      );
    });

    it("should fail if book doesn't exist", () => {
      assertEquals(
        library.listBorrowed({ customerId: 1 }),
        { success: false, errorCode: 404 },
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
          data: {
            bookId: 1,
            title: bookDetails.title,
            author: bookDetails.author,
          },
        },
      );
    });

    it("should fail if customer details is invalid", () => {
      assertEquals(
        library.returnBook({ customerId: 5 }),
        { success: false, errorCode: 402 },
      );
    });

    it("should fail if book details is invalid", () => {
      assertEquals(
        library.returnBook({ customerId: 1, bookId: 2 }),
        { success: false, errorCode: 402 },
      );
    });
  });
});
