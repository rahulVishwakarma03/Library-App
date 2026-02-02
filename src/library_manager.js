const getHandlers = (library) => {
  const handlers = {
    registerCustomer: (data) => library.registerCustomer(data),
    registerAdmin: (data) => library.registerAdmin(data),
    loginCustomer: (data) => library.loginCustomer(data),
  };
  return handlers;
};

export const processRequest = (library, { command, data }) => {
  const handlers = getHandlers(library);
  return handlers[command](data);
};
