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
};