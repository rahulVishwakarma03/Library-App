import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
  ServerError,
  ValidationError,
} from "../src/utils/custom_errors.js";

describe("Custom Errors", () => {
  it("ValidationError", () => {
    const errMsg = "Email is undefined";
    const error = new ValidationError(errMsg);
    assertEquals(error.status, 400);
    assertEquals(error.message, errMsg);
  });

  it("AuthenticationError", () => {
    const errMsg = "login credential mismatched";
    const error = new AuthenticationError(errMsg);
    assertEquals(error.status, 401);
    assertEquals(error.message, errMsg);
  });

  it("NotFoundError", () => {
    const errMsg = "login credential mismatched";
    const error = new NotFoundError(errMsg);
    assertEquals(error.status, 404);
    assertEquals(error.message, errMsg);
  });

  it("ConflictError", () => {
    const errMsg = "Customer Already Exists";
    const error = new ConflictError(errMsg);
    assertEquals(error.status, 409);
    assertEquals(error.message, errMsg);
  });

  it("ServerError", () => {
    const errMsg = "DB connection failed";
    const error = new ServerError(errMsg);
    assertEquals(error.status, 500);
    assertEquals(error.message, errMsg);
  });
});
