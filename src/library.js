export class Library {
  #library;
  #currentCustomerId;
  #currentBookId;

  constructor(library) {
    this.#library = library;
    this.#library.customers = [];
    this.#library.books = [];
    this.#currentCustomerId = 0;
    this.#currentBookId = 0;
  }

  registerCustomer(customerName, email, password) {
    this.#library.customers.push({
      customerId : ++(this.#currentCustomerId),
      customerName,
      email,
      password,
      borrowed : []
    })

    return {success : true}
  }
}