import {
  createSelector,
  handleLogin,
  handleRegistration,
} from "./customer_ui.js";

const adminMenuChoices = [
  { name: "Add Book", value: "addBook" },
  { name: "List Books", value: "listBooks" },
  { name: "Manage Book", value: "manageBook" },
  { name: "Back", value: "back" },
];

const manageAdminMenu = async (handler) => {
  while (true) {
    const action = await createSelector("Select action : ", adminMenuChoices);

    if (action === "back") {
      return;
    }
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

    if (action === "Register") {
      await handleRegistration(handler, "/admin/register");
    }

    if (action === "Login") {
      await handleLogin(handler, "/admin/login", manageAdminMenu);
    }
  }
};
