import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Library } from "../src/library.js";
import { handleRequest } from "../src/library_manager.js";

describe("Library Manager", () => {
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
    bookDetails = { title: "Let Us C", author: "Yaswant Kanetkar", total: 5 };
  });

  it("customer registration request", () => {
    assertEquals(
      handleRequest(library, {
        command: "registerCustomer",
        data: registrationDetails,
      }),
      { success: true },
    );
  });

  it("customer login request", () => {
    assertEquals(
      handleRequest(library, {
        command: "loginCustomer",
        data: loginDetails,
      }),
      { success: false, errorCode: 402 },
    );
  });

  it("admin registration request", () => {
    assertEquals(
      handleRequest(library, {
        command: "registerAdmin",
        data: registrationDetails,
      }),
      { success: true },
    );
  });

  it("admin login request", () => {
    assertEquals(
      handleRequest(library, {
        command: "loginAdmin",
        data: loginDetails,
      }),
      { success: false, errorCode: 402 },
    );
  });

  it("add book request", () => {
    assertEquals(
      handleRequest(library, {
        command: "addBook",
        data: bookDetails,
      }),
      { success: true },
    );
  });
});
