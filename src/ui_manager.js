import { manageAdmin } from "./admin_ui.js";
import { createSelector, manageCustomer } from "./customer_ui.js";

export const uiManager = async (handler) => {
  while (true) {
    const option = await createSelector(
      "Select your role : ",
      ["Customer", "Admin", "Exit"],
    );

    if (option === "Exit") return;

    if (option === "Customer") {
      await manageCustomer(handler);
    }
    if (option === "Admin") {
      await manageAdmin(handler);
    }
  }
};
