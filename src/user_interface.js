import { input, password, select } from "@inquirer/prompts";
import { handleUserRequest } from "../src/agent.js";

const mainMenuChoices = [
  { name: "Customer", value: "customer" },
  { name: "Admin", value: "admin" },
  { name: "Exit", value: "exit" },
];

const createSelector = async (message, choices) => {
  return await select({ message, choices });
};

export const handleCustomerReg = async (conn) => {
  const name = await input({ message: "Enter your name : " });
  const email = await input({ message: "Enter your email : " });
  const userPassword = await password({
    message: "Enter your password : ",
    mask: true,
  });

  const request = {
    command: "registerCustomer",
    data: { name, email, password: userPassword },
  };

  const response = await handleUserRequest(conn, request);
  console.log(response);
  return;
};

const manageCustomersOperations = async (conn) => {
  while (true) {
    const action = await createSelector("Select action : ", [
      "Register",
      "Login",
      "Back",
    ]);

    if (action === "Back") return;
    if (action === "Register") {
      await handleCustomerReg(conn);
    }
  }
};

export const uiManager = async (conn) => {
  while (true) {
    const option = await createSelector("Select your role : ", mainMenuChoices);
    if (option === "exit") return;

    if (option === "customer") {
      await manageCustomersOperations(conn);
    }

    if (option === "admin") {
      await handleAdminOperations(conn);
    }
  }
};
