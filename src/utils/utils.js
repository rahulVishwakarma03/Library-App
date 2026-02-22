import { ValidationError } from "./custom_errors.js";

export const extractBearerToken = (request) => {
  const authHeader = request.headers.get("authorization");
  const authToken = authHeader.split(" ")[1];
  return parseInt(authToken);
};

export const validateInputType = (inputs, predicate) => {
  const result = Object.values(inputs).every(predicate);
  if (!result) {
    throw new ValidationError("Invalid input format");
  }
};
