import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Library } from "../src/library.js";

describe("Library", () => {
  let library;
  let registrationDetails;
  let loginDetails;
  let bookDetails;

  beforeEach(() => {
    library = new Library({});
    registrationDetails = {
      name: "ABC",
      email: "abc@gmail.com",
      password: "123",
    };
    loginDetails = { email: "abc@gmail.com", password: "123" };
    bookDetails = { title: "Let Us C", author: "Yashwant Kanetkar", total: 5 };
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
        { success: true, data: { id: 1 } },
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
    it("should return a book's details if book exists", () => {
      library.addBook(bookDetails);
      assertEquals(
        library.viewBook({ id: 1 }),
        {
          success: true,
          data: { ...bookDetails, id: 1, available: bookDetails.total },
        },
      );
    });

    it("should fail if book doesn't exist", () => {
      assertEquals(
        library.viewBook({ id: 1 }),
        { success: false, errorCode: 403 },
      );
    });
  });

  describe("delete a Book", () => {
    it("should delete a book's details if book exists", () => {
      library.addBook(bookDetails);
      assertEquals(
        library.deleteBook({ id: 1 }),
        {
          success: true,
          data: { ...bookDetails, id: 1, available: bookDetails.total },
        },
      );
      assertEquals(library.viewBook({ id: 1 }), {
        success: false,
        errorCode: 403,
      });
    });

    it("should fail if book doesn't exist", () => {
      assertEquals(
        library.deleteBook({ id: 1 }),
        { success: false, errorCode: 403 },
      );
    });
  });

  describe("List Books", () => {
    it("should return all books", () => {
      library.addBook(bookDetails);
      assertEquals(
        library.listBooks(),
        {
          success: true,
          data: [{ ...bookDetails, id: 1, available: bookDetails.total }],
        },
      );
    });

    it("should fail if book doesn't exist", () => {
      assertEquals(
        library.listBooks(),
        { success: false, errorCode: 404 },
      );
    });
  });
});
