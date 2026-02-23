const URL = "http://localhost:8000";

export const mockRequests = {
  registerCustomer: {
    url: URL + "/members/register",
    method: "POST",
    body: { name: "abc", email: "abc@gmail.com", password: "1234" },
  },
  registerAdmin: {
    url: URL + "/admins/register",
    method: "POST",
    body: { name: "abc", email: "abc@gmail.com", password: "1234" },
  },
  loginCustomer: {
    url: URL + "/members/login",
    method: "POST",
    body: { email: "abc@gmail.com", password: "1234" },
  },
  invalidCustomerLoginDetails: {
    url: URL + "/members/login",
    method: "POST",
    body: { email: "abc12@gmail.com", password: "1234" },
  },
  loginAdmin: {
    url: URL + "/admins/login",
    method: "POST",
    body: { email: "abc@gmail.com", password: "1234" },
  },
  addBook: {
    url: URL + "/books/add",
    method: "POST",
    body: {
      title: "Let Us C",
      author: "Yaswant Kanetkar",
      total: 5,
    },
  },
  updateQuantity: {
    url: URL + "/books/updateQuantity",
    method: "POST",
    body: { bookId: 1, quantity: 4 },
  },
  viewBook: {
    url: URL + "/books/view",
    method: "POST",
    body: { bookId: 1 },
  },
  removeBook: {
    url: URL + "/books/remove",
    method: "POST",
    body: { bookId: 1 },
  },
  listAllBooks: {
    url: URL + "/books/list",
    method: "GET",
  },
  listAllCustomers: {
    url: URL + "/members/list",
    method: "GET",
  },
  borrowBook: {
    url: URL + "/borrows/borrow",
    method: "POST",
    body: { memberId: 1, bookId: 1 },
  },
  listBorrowed: {
    url: URL + "/borrows/list?memberId=1",
    method: "GET",
  },
  returnBook: {
    url: URL + "/borrows/return",
    method: "POST",
    body: { transactionId: 1 },
  },
};
