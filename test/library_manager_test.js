import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Library } from "../src/library.js";
import { processRequest } from "../src/library_manager.js";

describe("Library Manager", () => {
  let library;
  let registrationDetails;
  let loginDetails;

  beforeEach(() => {
    library = new Library({});
    registrationDetails = {
      name: "ABC",
      email: "abc@gmail.com",
      password: "123",
    };
    loginDetails = { email: "abc@gmail.com", password: "123" };
  });

  it("customer registration request", () => {
    assertEquals(
      processRequest(library, {
        command: "registerCustomer",
        data: registrationDetails,
      }),
      { success: true },
    );
  });

  it("customer login request", () => {
    assertEquals(
      processRequest(library, {
        command: "loginCustomer",
        data: loginDetails,
      }),
      { success: false, errorCode: 402 },
    );
  });

  it("admin registration request", () => {
    assertEquals(
      processRequest(library, {
        command: "registerAdmin",
        data: registrationDetails,
      }),
      { success: true },
    );
  });
});
