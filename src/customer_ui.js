import { input, password, select } from "@inquirer/prompts";

const log = (message) => {
  console.log(`\n${message}\n`);
};

export const createSelector = async (message, choices) => {
  return await select({ message, choices });
};

export const takeRegDetails = async () => {
  const name = await input({ message: "Enter your name : " });
  const email = await input({ message: "Enter your email : " });
  const userPassword = await password({
    message: "Enter your password : ",
    mask: true,
  });

  return { name, email, password: userPassword };
};

export const takeLoginDetails = async () => {
  const email = await input({ message: "Enter your email : " });
  const userPassword = await password({
    message: "Enter your password : ",
    mask: true,
  });

  return { email, password: userPassword };
};

export const handleRegistration = async (handler, path) => {
  const { name, email, password } = await takeRegDetails();
  const response = await handler(
    path,
    "POST",
    { name, email, password },
  );

  const body = await response.json();
  log(body.message);
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

const createBooksChoices = (books) =>
  books.map(({ bookId, title, available }) => ({
    name: title,
    value: bookId,
    disabled: available === 0,
  }));

const handleBookSelection = async (books) => {
  const choices = createBooksChoices(books);
  const bookId = await createSelector("Select a book : ", choices);

  return bookId;
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

const manageCustomerMenu = async (handler, customerId) => {
  while (true) {
    const action = await createSelector(
      "Select action : ",
      ["Books", "Borrowed", "Back"],
    );

    if (action === "Books") {
      await manageAvailableBooks(handler, customerId);
    }
    if (action === "Borrowed") {
      await manageBorrowedBooks(handler, customerId);
    }
    if (action === "Back") {
      return;
    }
  }
};

export const handleLogin = async (handler, path, onLogin) => {
  const { email, password } = await takeLoginDetails();

  const response = await handler(
    path,
    "POST",
    { email, password },
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

    if (action === "Register") {
      await handleRegistration(handler, "/customer/register");
    }

    if (action === "Login") {
      await handleLogin(handler, "/customer/login", manageCustomerMenu);
    }
  }
};
