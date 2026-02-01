import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Library } from "../src/library.js";

describe("Library", () => {
  let library;
  beforeEach(() => {
    library = new Library({});
  });

  describe("Customer Registration", () => {
    it("register customer", () => {
      assertEquals(
        library.registerCustomer({name : "Rahul", email : "abc@gmail.com", password : "123"}).success,
        true,
      );
    });
  });

  describe("Customer Login", () => {
    it("should login if customer is registered", () => {
      library.registerCustomer({name : "Rahul", email : "abc@gmail.com", password : "123"});
      assertEquals(
        library.loginCustomer({email : "abc@gmail.com", password : "123"}).success,
        true,
      );
    });
    
    it("should failed if customer is not registered", () => {
      assertEquals(
        library.loginCustomer("abc@gmail.com", "123").success,
        false,
      );
    });
  });
});
