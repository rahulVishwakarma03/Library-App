import { NotFoundError } from "../utils/custom_errors.js";

export const bookRouteHandler = {
  GET: {
    "/books/list": (library, data) => library.listAllBooks(data),
  },
  POST: {
    "/books/add": (library, data) => library.addBook(data),
    "/books/updateQuantity": (library, data) => library.updateQuantity(data),
    "/books/view": (library, data) => library.viewBook(data),
    "/books/remove": (library, data) => library.removeBook(data),
  },
};

export const handleBookService = async (library, request) => {
  const { url, method } = request;
  const path = new URL(url).pathname;

  if (method === "GET" && path in bookRouteHandler.GET) {
    const handler = bookRouteHandler.GET[path];
    return await handler(library);
  }

  if (method === "POST" && path in bookRouteHandler.POST) {
    const body = await request.json();
    const handler = bookRouteHandler.POST[path];
    return await handler(library, body);
  }

  throw new NotFoundError("Path not found");
};
