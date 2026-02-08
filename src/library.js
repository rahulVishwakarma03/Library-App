import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from "./custom_errors.js";

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
      throw new ConflictError("Customer already exists");
    }

    this.#library.customers.push({
      customerId: ++this.#currentCustomerId,
      name,
      email,
      password,
      borrowed: [],
    });

    return { success: true, status: 201 };
  }

  registerAdmin({ name, email, password }) {
    if (Object.keys(this.#library.admin).length !== 0) {
      throw new ConflictError("Admin already exists");
    }

    this.#library.admin = {
      adminId: 1,
      name,
      email,
      password,
    };

    return { success: true, status: 201 };
  }

  loginCustomer({ email, password }) {
    const customer = this.#findInList(this.#library.customers, {
      email,
      password,
    });

    if (!customer) {
      throw new AuthenticationError("Customer login credential mismatched");
    }

    return {
      success: true,
      status: 200,
      data: { customerId: customer.customerId },
    };
  }

  loginAdmin({ email, password }) {
    const { adminId, email: orgEmail, password: orgPassword } =
      this.#library.admin;

    if (email === orgEmail && password === orgPassword) {
      return { success: true, status: 200, data: { adminId } };
    }

    throw new AuthenticationError("Admin login credential mismatched");
  }

  addBook({ title, author, total }) {
    const doesBookExist = this.#library.books.some((book) =>
      book.title === title && book.author === author
    );

    if (doesBookExist) {
      throw new ConflictError("Book already exists");
    }

    this.#library.books.push({
      bookId: ++this.#currentBookId,
      title,
      author,
      total,
      available: total,
    });

    return {
      success: true,
      status: 201,
      data: { bookId: this.#currentBookId },
    };
  }

  viewBook({ bookId }) {
    const book = this.#library.books.find((book) => book.bookId === bookId);

    if (!book) {
      throw new NotFoundError("Book not found");
    }

    return { success: true, status: 200, data: book };
  }

  removeBook({ bookId }) {
    const index = this.#library.books.findIndex((book) =>
      book.bookId === bookId
    );

    if (index === -1) {
      throw new AuthenticationError("Wrong bookId");
    }

    this.#library.books.splice(index, 1);

    return { success: true, status: 204 };
  }

  listAllBooks() {
    const books = this.#library.books;
    if (books.length === 0) {
      throw new NotFoundError("No books available");
    }

    return { success: true, status: 200, data: books };
  }

  listBorrowed({ customerId }) {
    const customer = this.#library.customers.find((customer) =>
      customer.customerId === customerId
    );

    if (customer === undefined) {
      throw new AuthenticationError("Wrong customerId");
    }

    const borrowedBooks = customer.borrowed;

    if (borrowedBooks.length === 0) {
      throw new NotFoundError("No book borrowed");
    }

    return { success: true, status: 200, data: borrowedBooks };
  }

  borrowBook({ customerId, bookId: bId }) {
    const customer = this.#library.customers.find((customer) =>
      customer.customerId === customerId
    );

    const book = this.#library.books.find((book) => book.bookId === bId);

    if (customer === undefined || book === undefined) {
      throw new AuthenticationError("Wrong customerId or bookId");
    }

    const { bookId, title, author, available } = book;

    if (available === 0) {
      throw new ConflictError("Insufficient book copies");
    }

    customer.borrowed.push({ bookId, title, author });
    book.available -= 1;
    return { success: true, status: 204 };
  }

  returnBook({ customerId, bookId: bId }) {
    const customer = this.#library.customers.find((customer) =>
      customer.customerId === customerId
    );
    const book = this.#library.books.find((book) => book.bookId === bId);

    if (customer === undefined) {
      throw new AuthenticationError("Wrong customerId");
    }

    const bookIndex = customer.borrowed.findIndex((book) =>
      book.bookId === bId
    );

    if (bookIndex === -1) {
      throw new AuthenticationError("Wrong bookId");
    }

    customer.borrowed.splice(bookIndex, 1);
    book.available += 1;
    return { success: true, status: 204 };
  }
}
