import { ValidationError } from "./custom_errors.js";

const handlersForGET = {
  "/listAllBooks": (library) => library.listAllBooks(),
  "/listAllCustomers": (library) => library.listAllCustomers(),
};

const handlersForPOST = {
  "/customer/register": (library, data) => library.registerCustomer(data),
  "/admin/register": (library, data) => library.registerAdmin(data),
  "/customer/login": (library, data) => library.loginCustomer(data),
  "/admin/login": (library, data) => library.loginAdmin(data),
  "/addBook": (library, data) => library.addBook(data),
  "/viewBook": (library, data) => library.viewBook(data),
  "/removeBook": (library, data) => library.removeBook(data),
  "/borrowBook": (library, data) => library.borrowBook(data),
  "/listBorrowed": (library, data) => library.listBorrowed(data),
  "/returnBook": (library, data) => library.returnBook(data),
};

const createErrorResponse = ({ status, name, message }) => {
  const body = {
    success: false,
    errorName: name,
    message,
  };

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
};

const validateRequest = (method, path) => {
  const handlers = {
    "GET": handlersForGET,
    "POST": handlersForPOST,
  };

  if (!handlers[method][path]) {
    throw new ValidationError("Invalid request!");
  }
};

export const handleRequest = async (library, request) => {
  const { method, url } = request;
  const path = new URL(url).pathname;

  try {
    validateRequest(method, path);

    if (method === "POST") {
      const body = await request.json();
      console.log({ method, url, body });

      return handlersForPOST[path](library, body);
    }

    console.log({ method, url });
    return handlersForGET[path](library);
  } catch (error) {
    return createErrorResponse(error);
  }
};

export const createRequestHandler = (library) => async (request) =>
  await handleRequest(library, request);
