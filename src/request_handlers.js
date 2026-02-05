const requestHandlers = {
  registerCustomer: (library, data) => library.registerCustomer(data),
  registerAdmin: (library, data) => library.registerAdmin(data),
  loginCustomer: (library, data) => library.loginCustomer(data),
  loginAdmin: (library, data) => library.loginAdmin(data),
  addBook: (library, data) => library.addBook(data),
  viewBook: (library, data) => library.viewBook(data),
  deleteBook: (library, data) => library.deleteBook(data),
};

export const handleRequest = (library, { command, data }) => {
  return requestHandlers[command](library, data);
};
