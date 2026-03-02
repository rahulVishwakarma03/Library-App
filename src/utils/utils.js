import { ValidationError } from "./custom_errors.js";

export const validateInputType = (inputs, predicate) => {
  const result = Object.values(inputs).every(predicate);
  if (!result) {
    throw new ValidationError("Invalid input format");
  }
};

export const isString = (el) => typeof el === "string" && el !== "";
export const isInteger = (el) => Number.isInteger(el);
