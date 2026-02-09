import { input, password, select } from "@inquirer/prompts";
import { handleUserRequest } from "../src/agent.js";

const createListsChoices = async (handler, path) => {
  const response = await handler(
    path,
    "GET",
  );
  books = await response.json();
  const choices = books.map(({ bookId, title, available }) => ({
    name: title,
    value: bookId,
    disabled: !available,
  }));

  return choices;
};

const log = (message) => {
  console.log(`\n${message}\n`);
};

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

const takeLoginDetails = async () => {
  const email = await input({ message: "Enter your email : " });
  const userPassword = await password({
    message: "Enter your password : ",
    mask: true,
  });

  return { email, password: userPassword };
};

export const handleCustomerReg = async (handler) => {
  const { name, email, password } = await takeRegDetails();
  const response = await handler(
    "/customer/register",
    "POST",
    JSON.stringify({ name, email, password }),
  );
  const body = await response.json();
  log(body.message);
  return;
};

export const handleCustomerLogin = async (handler) => {
  const { email, password } = await takeLoginDetails();
  const response = await handler(
    "/customer/login",
    "POST",
    JSON.stringify({ email, password }),
  );
  const body = await response.json();
  log(body.message);
  return body.customerId;
};

const handleBookBorrows = async (handler, customerId) => {
  const choices = createListsChoices(handler, "/listAllBooks");
  const bookId = await createSelector("Select a book : ", choices);
  const action = await createSelector("Select action : ", ["Borrow", "Back"]);

  if (action === "Back") return;
  const response = await handler("/borrowBook", "POST", {
    customerId,
    bookId,
  });

  const data = await response.json();
  log(data.message);
  return;
};

const handleCustomersOperations = async (handler, customerId) => {
  while (true) {
    const action = await createSelector("Select action : ", [
      "Books",
      "Borrowed",
      "Back",
    ]);

    if (action === "Back") return;
    if (action === "Books") {
      await handleBookBorrows(handler, customerId);
    }
    if (action === "Borrowed") {
      await handleBookReturns(handler, customerId);
    }
  }
};

const manageCustomer = async (handler) => {
  while (true) {
    const action = await createSelector("Select action : ", [
      "Register",
      "Login",
      "Back",
    ]);

    if (action === "Back") return;
    if (action === "Register") {
      await handleCustomerReg(handler);
    }
    if (action === "Login") {
      const customerId = await handleCustomerLogin(handler);
      // await handleCustomersOperations(handler, customerId);
    }
  }
};

export const uiManager = async (handler) => {
  while (true) {
    const option = await createSelector("Select your role : ", [
      "Customer",
      "Admin",
      "Exit",
    ]);
    if (option === "Exit") return;

    if (option === "Customer") {
      await manageCustomer(handler);
    }
  }
};
