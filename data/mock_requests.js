export const mock_requests = {
  registerCustomer: {
    command: "registerCustomer",
    data: { name: "abc", email: "abc@gmail.com", password: "1234" },
  },
  registerAdmin: {
    command: "registerAdmin",
    data: { name: "abc", email: "abc@gmail.com", password: "1234" },
  },
  loginCustomer: {
    command: "loginCustomer",
    data: { email: "abc@gmail.com", password: "1234" },
  },
  invalidCustomerLoginDetails: {
    command: "loginCustomer",
    data: { email: "abc12@gmail.com", password: "1234" },
  },
  loginAdmin: {
    command: "loginAdmin",
    data: { email: "abc@gmail.com", password: "1234" },
  },
  invalidAdminLoginDetails: {
    command: "loginAdmin",
    data: { email: "abc12@gmail.com", password: "1234" },
  },
  addBook: {
    command: "addBook",
    data: { title: "Let Us C", author: "Yaswant Kanetkar", total: 5 },
  },
  viewBook: {
    command: "viewBook",
    data: { id: 1 },
  },
  deleteBook: {
    command: "deleteBook",
    data: { id: 1 },
  },
};
