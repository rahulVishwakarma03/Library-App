export class Library {
  #library;
  #currentCustomerId;
  #currentBookId;
  #currentAdminId;

  constructor(library) {
    this.#library = library;
    this.#library.admins = [];
    this.#library.customers = [];
    this.#library.books = [];
    this.#currentCustomerId = 0;
    this.#currentBookId = 0;
    this.#currentAdminId = 0;
  }

  registerCustomer({ name, email, password }) {
    const doesExists = this.#library.customers.some((customer) =>
      customer.email === email && customer.password === password
    );

    if (doesExists) {
      return { success: false, errorCode: 401 };
    }

    this.#library.customers.push({
      id: ++this.#currentCustomerId,
      name,
      email,
      password,
      borrowed: [],
    });

    return { success: true };
  }

  registerAdmin({ name, email, password }) {
    const doesExists = this.#library.admins.some((admin) =>
      admin.email === email && admin.password === password
    );

    if (doesExists) {
      return { success: false, errorCode: 401 };
    }

    this.#library.admins.push({
      id: ++this.#currentAdminId,
      name,
      email,
      password,
    });

    return { success: true };
  }

  loginCustomer({ email, password }) {
    const currCustomer = this.#library.customers.find((customer) =>
      customer.email === email && customer.password === password
    );

    return currCustomer
      ? { success: true, data: { id: currCustomer.id } }
      : { success: false, errorCode: 402 };
  }

  loginAdmin({ email, password }) {
    const currAdmin = this.#library.admins.find((admin) =>
      admin.email === email && admin.password === password
    );

    return currAdmin ? { success: true, data : {id : currAdmin.id} } : { success: false, errorCode: 402 };
  }
}
