import { input, password, select } from "@inquirer/prompts";

const log = (message) => {
  console.log(`\n${message}\n`);
};

const createBooksChoices = (books) =>
  books.map(({ bookId, title, available }) => ({
    name: title,
    value: bookId,
    disabled: available === 0,
  }));

const createSelector = async (message, choices) => {
  return await select({ message, choices });
};

const handleBookSelection = async (books) => {
  const choices = createBooksChoices(books);
  const bookId = await createSelector("Select a book : ", choices);

  return bookId;
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
    { name, email, password },
  );

  const body = await response.json();
  log(body.message);
};

export const handleCustomerLogin = async (handler) => {
  const { email, password } = await takeLoginDetails();

  const response = await handler(
    "/customer/login",
    "POST",
    { email, password },
  );

  const body = await response.json();
  const customerId = body.data.customerId;
  log(body.message);

  if (customerId === undefined) return;
  return await handleCustomerMenu(handler, customerId);
};

const handleBookBorrows = async (handler, customerId, bookId) => {
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

const handleBookReturns = async (handler, customerId, bookId) => {
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

const manageAvailableBooks = async (handler, customerId) => {
  const response = await handler("/listAllBooks", "GET");
  const body = await response.json();

  if (response.status === 200) {
    const bookId = await handleBookSelection(body.data);
    await handleBookBorrows(handler, customerId, bookId);
    return;
  }

  log(body.message);
};

const manageBorrowedBooks = async (handler, customerId) => {
  const response = await handler("/listBorrowed", "POST", { customerId });
  const body = await response.json();

  if (response.status === 200) {
    const bookId = await handleBookSelection(body.data);
    await handleBookReturns(handler, customerId, bookId);
    return;
  }
  log(body.message);
};

const handleCustomerMenu = async (handler, customerId) => {
  while (true) {
    const action = await createSelector("Select action : ", [
      "Books",
      "Borrowed",
      "Back",
    ]);

    switch (action) {
      case "Books":
        await manageAvailableBooks(handler, customerId);
        break;
      case "Borrowed":
        await manageBorrowedBooks(handler, customerId);
        break;
      case "Back":
        return;
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
      await handleCustomerLogin(handler);
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
