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

const takeRegDetails = async () => {
  const name = await input({ message: "Enter your name : " });
  const email = await input({ message: "Enter your email : " });
  const userPassword = await password({
    message: "Enter your password : ",
    mask: true,
  });

  return { name, email, password: userPassword };
};

export const handleCustomerReg = async () => {
  const { name, email, password } = await takeRegDetails();
  const response = await handleUserRequest(
    "/customer/register",
    "POST",
    JSON.stringify({ name, email, password }),
  );
  const body = await response.json();
  console.log(body.message);
  return;
};

const manageCustomersOperations = async () => {
  while (true) {
    const action = await createSelector("Select action : ", [
      "Register",
      "Login",
      "Back",
    ]);

    if (action === "Back") return;
    if (action === "Register") {
      await handleCustomerReg();
    }
  }
};

export const uiManager = async () => {
  while (true) {
    const option = await createSelector("Select your role : ", mainMenuChoices);
    if (option === "exit") return;

    if (option === "customer") {
      await manageCustomersOperations();
    }

    if (option === "admin") {
      await handleAdminOperations();
    }
  }
};
