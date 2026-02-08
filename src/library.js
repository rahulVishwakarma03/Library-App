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

  #findCustomerBy(details) {
    return this.#library.customers.find((el) =>
      el.customerId === details.customerId ||
      (el.email === details.email && el.password === details.password)
    );
  }

  #findBookBy(details) {
    return this.#library.books.find((el) =>
      el.bookId === details.bookId ||
      (el.title === details.title && el.author === details.author)
    );
  }

  registerCustomer({ name, email, password }) {
    const customer = this.#findCustomerBy({ email, password });

    if (customer) {
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
    const customer = this.#findCustomerBy({ email, password });

    if (!customer) {
      throw new AuthenticationError("Customer login credential is wrong");
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

    throw new AuthenticationError("Admin login credential is wrong");
  }

  addBook({ title, author, total }) {
    const book = this.#findBookBy({ title, author });

    if (book) {
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
    const book = this.#findBookBy({ bookId });

    if (!book) {
      throw new NotFoundError("Book not found");
    }

    return { success: true, status: 200, data: book };
  }

  removeBook({ bookId }) {
    const bookIndex = this.#library.books.findIndex((book) =>
      book.bookId === bookId
    );

    if (bookIndex === -1) {
      throw new AuthenticationError("Wrong bookId");
    }

    this.#library.books.splice(bookIndex, 1);

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
    const customer = this.#findCustomerBy({ customerId });

    if (customer === undefined) {
      throw new AuthenticationError("Wrong customerId");
    }

    const borrowedBooks = customer.borrowed;

    if (borrowedBooks.length === 0) {
      throw new NotFoundError("No book borrowed");
    }

    return { success: true, status: 200, data: borrowedBooks };
  }

  borrowBook({ customerId, bookId }) {
    const customer = this.#findCustomerBy({ customerId });

    const book = this.#findBookBy({ bookId });

    if (customer === undefined || book === undefined) {
      throw new AuthenticationError("Wrong customerId or bookId");
    }

    const { title, author, available } = book;

    if (available === 0) {
      throw new ConflictError("Insufficient book copies");
    }

    customer.borrowed.push({ bookId, title, author });
    book.available -= 1;
    return { success: true, status: 204 };
  }

  returnBook({ customerId, bookId }) {
    const customer = this.#findCustomerBy({ customerId });
    const book = this.#findBookBy({ bookId });

    if (customer === undefined) {
      throw new AuthenticationError("Wrong customerId");
    }

    const bookIndex = customer.borrowed.findIndex((book) =>
      book.bookId === bookId
    );

    if (bookIndex === -1) {
      throw new AuthenticationError("Wrong bookId");
    }

    customer.borrowed.splice(bookIndex, 1);
    book.available += 1;
    return { success: true, status: 204 };
  }
}
