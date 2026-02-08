const requestHandlers = {
  registerCustomer: (library, data) => library.registerCustomer(data),
  registerAdmin: (library, data) => library.registerAdmin(data),
  loginCustomer: (library, data) => library.loginCustomer(data),
  loginAdmin: (library, data) => library.loginAdmin(data),
  addBook: (library, data) => library.addBook(data),
  viewBook: (library, data) => library.viewBook(data),
  removeBook: (library, data) => library.removeBook(data),
  listAllBooks: (library, data) => library.listAllBooks(data),
  borrowBook: (library, data) => library.borrowBook(data),
  listBorrowed: (library, data) => library.listBorrowed(data),
  returnBook: (library, data) => library.returnBook(data),
};

export const handleRequest = (library, { command, data }) => {
  try {
    return requestHandlers[command](library, data);
  } catch (error) {
    return {
      success: false,
      status: error.status,
      errorName: error.name,
      message: error.message,
    };
  }
};
