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

  #createResponse(status, body) {
    return new Response(JSON.stringify(body), {
      status,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  registerCustomer({ name, email, password }) {
    const customer = this.#findCustomerBy({ email, password });

    if (customer !== undefined) {
      throw new ConflictError("Customer already exists");
    }

    this.#library.customers.push({
      customerId: ++this.#currentCustomerId,
      name,
      email,
      password,
      borrowed: [],
    });
    return this.#createResponse(201, {
      success: true,
      message: "Customer Registered Successfully",
    });
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
    return this.#createResponse(201, {
      success: true,
      message: "Admin Registered Successfully",
    });
  }

  loginCustomer({ email, password }) {
    const customer = this.#findCustomerBy({ email, password });

    if (customer === undefined) {
      throw new AuthenticationError("Customer login credential is wrong");
    }

    return this.#createResponse(200, {
      success: true,
      data: { customerId: customer.customerId },
      message: "Customer loggedIn Successfully",
    });
  }

  loginAdmin({ email, password }) {
    const { adminId, email: orgEmail, password: orgPassword } =
      this.#library.admin;

    if (email === orgEmail && password === orgPassword) {
      return this.#createResponse(200, {
        success: true,
        data: { adminId },
        message: "Admin loggedIn Successfully",
      });
    }

    throw new AuthenticationError("Admin login credential is wrong");
  }

  addBook({ title, author, total }) {
    const book = this.#findBookBy({ title, author });

    if (book !== undefined) {
      throw new ConflictError("Book already exists");
    }

    this.#library.books.push({
      bookId: ++this.#currentBookId,
      title,
      author,
      total,
      available: total,
    });

    return this.#createResponse(201, {
      success: true,
      data: { bookId: this.#currentBookId },
      message: "Book Added successfully",
    });
  }

  viewBook({ bookId }) {
    const book = this.#findBookBy({ bookId });

    if (book === undefined) {
      throw new NotFoundError("Book not found");
    }
    return this.#createResponse(200, {
      success: true,
      data: book,
    });
  }

  removeBook({ bookId }) {
    const bookIndex = this.#library.books.findIndex((book) =>
      book.bookId === bookId
    );

    if (bookIndex === -1) {
      throw new AuthenticationError("Wrong bookId");
    }

    this.#library.books.splice(bookIndex, 1);

    return this.#createResponse(204);
  }

  listAllBooks() {
    const books = this.#library.books;
    if (books.length === 0) {
      throw new NotFoundError("No books available");
    }
    return this.#createResponse(200, {
      success: true,
      data: books,
    });
  }

  listAllCustomers() {
    const customers = this.#library.customers;
    if (customers.length === 0) {
      throw new NotFoundError("No customers available");
    }

    return this.#createResponse(200, {
      success: true,
      data: customers,
    });
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

    return this.#createResponse(200, {
      success: true,
      data: borrowedBooks,
    });
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

    return this.#createResponse(200, {
      success: true,
      message: "Book borrowed successfully",
    });
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

    return this.#createResponse(200, {
      success: true,
      data: { bookId },
      message: "Book returned successfully",
    });
  }
}
