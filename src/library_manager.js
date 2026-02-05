const handlers = {
  registerCustomer: (library, data) => library.registerCustomer(data),
  registerAdmin: (library, data) => library.registerAdmin(data),
  loginCustomer: (library, data) => library.loginCustomer(data),
  loginAdmin: (library, data) => library.loginAdmin(data),
  addBook: (library, data) => library.addBook(data),
};

export const handleRequest = (library, { command, data }) => {
  return handlers[command](library, data);
};
