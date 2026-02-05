export class Library {
  #library;
  #currentCustomerId;
  #currentBookId;

  constructor(library) {
    this.#library = library;
    this.#library.admin = {};
    this.#library.customers = [];
    this.#library.books = [];
    this.#currentCustomerId = 0;
    this.#currentBookId = 0;
  }

  #find(list, { email, password }) {
    return list.find((el) => el.email === email && el.password === password);
  }

  registerCustomer({ name, email, password }) {
    const doesExist = !!this.#find(this.#library.customers, {
      email,
      password,
    });

    if (doesExist) {
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
    if (Object.keys(this.#library.admin).length !== 0) {
      return { success: false, errorCode: 401 };
    }

    this.#library.admin = {
      name,
      email,
      password,
    };

    return { success: true };
  }

  loginCustomer({ email, password }) {
    const currCustomer = this.#find(this.#library.customers, {
      email,
      password,
    });

    return currCustomer
      ? { success: true, data: { id: currCustomer.id } }
      : { success: false, errorCode: 402 };
  }

  loginAdmin({ email, password }) {
    const { id, email: orgEmail, password: orgPassword } = this.#library.admin;

    return email === orgEmail && password === orgPassword
      ? { success: true, data: { email: orgEmail } }
      : { success: false, errorCode: 402 };
  }

  addBook({ title, author, total }) {
    const doesBookExist = this.#library.books.some((book) =>
      book.title === title && book.author === author
    );

    if (doesBookExist) {
      return { success: false, errorCode: 401 };
    }

    this.#library.books.push({
      id: ++this.#currentBookId,
      title,
      author,
      total,
      available: total,
    });

    return { success: true };
  }
}
