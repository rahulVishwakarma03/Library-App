const URL = "http://localhost:8000";

export const mockRequests = {
  registerCustomer: {
    url: URL + "/customer/register",
    method: "POST",
    body: { name: "abc", email: "abc@gmail.com", password: "1234" },
  },
  registerAdmin: {
    url: URL + "/admin/register",
    method: "POST",
    body: { name: "abc", email: "abc@gmail.com", password: "1234" },
  },
  loginCustomer: {
    url: URL + "/customer/login",
    method: "POST",
    body: { email: "abc@gmail.com", password: "1234" },
  },
  invalidCustomerLoginDetails: {
    url: URL + "/customer/login",
    method: "POST",
    body: { email: "abc12@gmail.com", password: "1234" },
  },
  loginAdmin: {
    url: URL + "/admin/login",
    method: "POST",
    body: { email: "abc@gmail.com", password: "1234" },
  },
  addBook: {
    url: URL + "/addBook",
    method: "POST",
    body: { title: "Let Us C", author: "Yaswant Kanetkar", total: 5 },
  },
  updateQuantity: {
    url: URL + "/updateQuantity",
    method: "POST",
    body: { bookId: 1, offset: 4 },
  },
  viewBook: {
    url: URL + "/viewBook",
    method: "POST",
    body: { bookId: 1 },
  },
  removeBook: {
    url: URL + "/removeBook",
    method: "POST",
    body: { bookId: 1 },
  },
  listAllBooks: {
    url: URL + "/listAllBooks",
    method: "GET",
  },
  listAllCustomers: {
    url: URL + "/listAllCustomers",
    method: "GET",
  },
  borrowBook: {
    url: URL + "/borrowBook",
    method: "POST",
    body: { customerId: 1, bookId: 1 },
  },
  listBorrowed: {
    url: URL + "/listBorrowed",
    method: "POST",
    body: { customerId: 1 },
  },
  returnBook: {
    url: URL + "/returnBook",
    method: "POST",
    body: { customerId: 1, bookId: 1 },
  },
};
