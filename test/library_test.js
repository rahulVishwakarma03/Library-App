import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Library } from "../src/library.js";

describe("Library", () => {
  let library;
  beforeEach(() => {
    library = new Library({});
  });

  describe("User Registration", () => {

    it("register user", () => {
      assertEquals(
        library.registerCustomer("Rahul", "abc@gmail.com", "123").success,
        true,
      );
    });
  });
});
