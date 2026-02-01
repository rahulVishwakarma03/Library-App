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

  registerCustomer({name, email, password}) {
    this.#library.customers.push({
      id: ++(this.#currentCustomerId),
      name,
      email,
      password,
      borrowed: [],
    });

    return { success: true };
  }

  loginCustomer({email, password}) {
    const customer = this.#library.customers.find((customer) =>
      customer.email === email && customer.password === password
    );
  
    return customer ? { success: true, data : {id : customer.id} } : { success: false };
  }
}
