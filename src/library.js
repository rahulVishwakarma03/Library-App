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

  #findInList(list, { email, password }) {
    return list.find((el) => el.email === email && el.password === password);
  }

  registerCustomer({ name, email, password }) {
    const doesExist = !!this.#findInList(this.#library.customers, {
      email,
      password,
    });

    if (doesExist) {
      return { success: false, errorCode: 401 };
    }

    this.#library.customers.push({
      customerId: ++this.#currentCustomerId,
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
    const currCustomer = this.#findInList(this.#library.customers, {
      email,
      password,
    });

    return currCustomer
      ? { success: true, data: { customerId: currCustomer.customerId } }
      : { success: false, errorCode: 402 };
  }

  loginAdmin({ email, password }) {
    const { email: orgEmail, password: orgPassword } = this.#library.admin;

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
      bookId: ++this.#currentBookId,
      title,
      author,
      total,
      available: total,
    });

    return { success: true };
  }

  viewBook({ bookId }) {
    const currBook = this.#library.books.find((book) => book.bookId === bookId);

    if (!currBook) {
      return { success: false, errorCode: 402 };
    }

    return { success: true, data: currBook };
  }

  removeBook({ bookId }) {
    const index = this.#library.books.findIndex((book) =>
      book.bookId === bookId
    );

    if (index === -1) {
      return { success: false, errorCode: 402 };
    }

    const deletedBook = this.#library.books.splice(index, 1);

    return { success: true, data: deletedBook[0] };
  }

  listAllBooks() {
    const books = this.#library.books;
    if (books.length === 0) {
      return { success: false, errorCode: 404 };
    }

    return { success: true, data: books };
  }

  listBorrowed({ customerId }) {
    const customer = this.#library.customers.find((customer) =>
      customer.customerId === customerId
    );

    if (customer === undefined) {
      return { success: false, errorCode: 402 };
    }

    const borrowedBooks = customer.borrowed;

    if (borrowedBooks.length === 0) {
      return { success: false, errorCode: 404 };
    }

    return { success: true, data: borrowedBooks };
  }

  borrowBook({ customerId, bookId: bId }) {
    const customer = this.#library.customers.find((customer) =>
      customer.customerId === customerId
    );

    const book = this.#library.books.find((book) => book.bookId === bId);

    if (customer === undefined || book === undefined) {
      return { success: false, errorCode: 402 };
    }

    const { bookId, title, author, available } = book;

    if (available === 0) {
      return { success: false, errorCode: 403 };
    }

    customer.borrowed.push({ bookId, title, author });
    book.available -= 1;
    return { success: true };
  }
}
