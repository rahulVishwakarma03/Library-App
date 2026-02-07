export const mockRequests = {
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
    data: { bookId: 1 },
  },
  removeBook: {
    command: "removeBook",
    data: { bookId: 1 },
  },
  listAllBooks: {
    command: "listAllBooks",
    data: {},
  },
  borrowBook: {
    command: "borrowBook",
    data: { customerId: 1, bookId: 1 },
  },
  listBorrowed: {
    command: "listBorrowed",
    data: { customerId: 1 },
  },
  returnBook: {
    command: "returnBook",
    data: { customerId: 1, bookId: 1 },
  },
};
