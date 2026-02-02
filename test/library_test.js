import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Library } from "../src/library.js";

describe("Library", () => {
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

    it("should failed if login details are inValid", () => {
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
        { success: true , data : {id : 1}},
      );
    });

    it("should failed if login details are inValid", () => {
      assertEquals(
        library.loginAdmin(loginDetails),
        { success: false, errorCode: 402 },
      );
    });
  })
});
