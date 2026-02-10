import { input, password, select } from "@inquirer/prompts";

export const log = (message) => {
  console.log(`\n---${message}---\n`);
};

export const createSelector = async (message, choices) => {
  return await select({ message, choices });
};

export const takeRegistrationInfo = async () => {
  const name = await input({ message: "Enter your name : " });
  const email = await input({ message: "Enter your email : " });
  const userPassword = await password({
    message: "Enter your password : ",
    mask: true,
  });

  return { name, email, password: userPassword };
};

export const takeLoginInfo = async () => {
  const email = await input({ message: "Enter your email : " });
  const userPassword = await password({
    message: "Enter your password : ",
    mask: true,
  });

  return { email, password: userPassword };
};

export const handleRegistration = async (handler, path) => {
  const registrationInfo = await takeRegistrationInfo();
  const response = await handler(
    path,
    "POST",
    registrationInfo,
  );

  const body = await response.json();
  log(body.message);
};

const handleBorrowBookMenu = async (handler, customerId, bookId) => {
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

const handleReturnBookMenu = async (handler, customerId, bookId) => {
  const action = await createSelector("Select action : ", ["Return", "Back"]);

  if (action === "Back") return;

  const response = await handler("/returnBook", "POST", {
    customerId,
    bookId,
  });

  const data = await response.json();
  log(data.message);
  return;
};

const createBooksChoices = (books) =>
  books.map(({ bookId, title, available }) => ({
    name: title,
    value: bookId,
    disabled: available === 0,
  }));

export const handleBookSelection = async (books) => {
  const choices = createBooksChoices(books);
  return await createSelector("Select a book : ", [...choices, "Back"]);
};

const manageAvailableBooks = async (handler, customerId) => {
  const response = await handler("/listAllBooks", "GET");
  const body = await response.json();

  if (response.status !== 200) {
    return log(body.message);
  }

  const option = await handleBookSelection(body.data);
  if (option === "Back") return;
  await handleBorrowBookMenu(handler, customerId, option);
};

const manageBorrowedBooks = async (handler, customerId) => {
  const response = await handler("/listBorrowed", "POST", { customerId });
  const body = await response.json();

  if (response.status !== 200) {
    return log(body.message);
  }

  const option = await handleBookSelection(body.data);
  if (option === "Back") return;
  await handleReturnBookMenu(handler, customerId, option);
};

const CUSTOMER_ACTION_MAPPER = {
  "Register": async (handler) =>
    await handleRegistration(handler, "/customer/register"),
  "Login": async (handler, onLogin) =>
    await handleLogin(handler, "/customer/login", onLogin),
  "Books": async (handler, customerId) =>
    await manageAvailableBooks(handler, customerId),
  "Borrowed": async (handler, customerId) =>
    await manageBorrowedBooks(handler, customerId),
};

const manageCustomerMenu = async (handler, customerId) => {
  while (true) {
    const action = await createSelector(
      "Select action : ",
      ["Books", "Borrowed", "Back"],
    );

    if (action === "Back") {
      return;
    }

    await CUSTOMER_ACTION_MAPPER[action](handler, customerId);
  }
};

export const handleLogin = async (handler, path, onLogin) => {
  const loginInfo = await takeLoginInfo();

  const response = await handler(
    path,
    "POST",
    loginInfo,
  );

  const body = await response.json();
  log(body.message);

  if (response.status === 200) {
    const customerId = body.data.customerId;
    return await onLogin(handler, customerId);
  }
};

export const manageCustomer = async (handler) => {
  while (true) {
    const action = await createSelector(
      "Select action : ",
      ["Register", "Login", "Back"],
    );

    if (action === "Back") return;

    await CUSTOMER_ACTION_MAPPER[action](handler, manageCustomerMenu);
  }
};
