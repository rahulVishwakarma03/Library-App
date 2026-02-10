import { input } from "@inquirer/prompts";
import {
  createSelector,
  handleBookSelection,
  handleLogin,
  handleRegistration,
  log,
} from "./customer_ui.js";

const adminMenuChoices = [
  { name: "Add Book", value: "addBook" },
  { name: "List Books", value: "listBooks" },
  { name: "Manage Book", value: "manageBook" },
  { name: "Back", value: "back" },
];

const booksMenuChoices = [
  { name: "View Book", value: "viewBook" },
  { name: "Remove Books", value: "removeBook" },
  { name: "Update Quantity", value: "updateQuantity" },
  { name: "Back", value: "back" },
];

const takeBookInfo = async () => {
  const title = await input({ message: "Enter book title : " });
  const author = await input({ message: "Enter author name : " });
  const total = await input({ message: "Enter total copies : " });

  return { title, author, total };
};

const listBooks = async (handler) => {
  const response = await handler("/listAllBooks", "GET");
  const body = await response.json();

  if (response.status === 200) {
    console.table(body.data);
    return;
  }

  log(body.message);
};

const viewBook = async (handler, bookId) => {
  const response = await handler("/viewBook", "POST", { bookId });
  const body = await response.json();

  if (response.status === 200) {
    console.table(body.data);
    return;
  }

  log(body.message);
};

const removeBook = async (handler, bookId) => {
  const response = await handler("/removeBook", "POST", { bookId });

  if (response.status === 204) {
    log("Book removed successfully!");
  }
};

const handleBookOperationsMenu = async (handler, bookId) => {
  while (true) {
    const action = await createSelector("Select action : ", booksMenuChoices);

    if (action === "back") {
      return;
    }

    if (action === "removeBook") {
      return await removeBook(handler, bookId);
    }

    await ADMIN_ACTION_MAPPER[action](handler, bookId);
  }
};

const manageBook = async (handler) => {
  const response = await handler("/listAllBooks", "GET");
  const body = await response.json();

  if (response.status === 200) {
    const books = body.data.map(({ bookId, title }) => ({ bookId, title }));

    const bookId = await handleBookSelection(books);
    return await handleBookOperationsMenu(handler, bookId);
  }

  log(body.message);
};

const addBook = async (handler) => {
  const book = await takeBookInfo();

  const response = await handler(
    "/addBook",
    "POST",
    book,
  );

  const body = await response.json();
  log(body.message);
};

const ADMIN_ACTION_MAPPER = {
  "Register": async (handler) =>
    await handleRegistration(handler, "/admin/register"),
  "Login": async (handler, onLogin) =>
    await handleLogin(handler, "/admin/login", onLogin),
  "addBook": addBook,
  "listBooks": listBooks,
  "manageBook": manageBook,
  "viewBook": viewBook,
  "updateQuantity": () => {},
};

const manageAdminMenu = async (handler) => {
  while (true) {
    const action = await createSelector("Select action : ", adminMenuChoices);

    if (action === "back") {
      return;
    }

    await ADMIN_ACTION_MAPPER[action](handler);
  }
};

export const manageAdmin = async (handler) => {
  while (true) {
    const action = await createSelector(
      "Select action : ",
      [
        { name: "Register", value: "Register", disabled: false },
        "Login",
        "Back",
      ],
    );

    if (action === "Back") return;

    await ADMIN_ACTION_MAPPER[action](handler, manageAdminMenu);
  }
};
