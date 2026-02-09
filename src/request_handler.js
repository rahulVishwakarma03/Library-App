const getRequestHandler = (library, command) => {
  const requestHandlers = {
    registerCustomer: library.registerCustomer.bind(library),
    registerAdmin: library.registerAdmin.bind(library),
    loginCustomer: library.loginCustomer.bind(library),
    loginAdmin: library.loginAdmin.bind(library),
    addBook: library.addBook.bind(library),
    viewBook: library.viewBook.bind(library),
    removeBook: library.removeBook.bind(library),
    listAllBooks: library.listAllBooks.bind(library),
    listAllCustomers: library.listAllCustomers.bind(library),
    borrowBook: library.borrowBook.bind(library),
    listBorrowed: library.listBorrowed.bind(library),
    returnBook: library.returnBook.bind(library),
  };

  return requestHandlers[command];
};

export const handleRequest = (library, { command, data }) => {
  try {
    const handler = getRequestHandler(library, command);
    return handler(data);
  } catch (error) {
    return {
      success: false,
      status: error.status,
      errorName: error.name,
      message: error.message,
    };
  }
};
