import { input } from "@inquirer/prompts";
import {
  createSelector,
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

const takeBookInfo = async () => {
  const title = await input({ message: "Enter book title : " });
  const author = await input({ message: "Enter author name : " });
  const total = await input({ message: "Enter total copies : " });

  return { title, author, total };
};

const listBooks = async (handler) => {};
const manageBook = async (handler) => {};

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
