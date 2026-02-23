import { ServerError } from "./utils/custom_errors.js";

export class DbClient {
  #db;
  constructor(db) {
    if (db === undefined) throw new ServerError("db doesn't exist!");
    this.#db = db;
  }

  findTables() {
    const query = `SELECT name FROM sqlite_master WHERE type='table';`;
    const table = this.#db.prepare(query).all();
    return table;
  }

  initializeSchema() {
    const adminsSchemaQuery = `
       CREATE TABLE IF NOT EXISTS admins (
       adminId INTEGER PRIMARY KEY AUTOINCREMENT,
       name TEXT NOT NULL,
       email TEXT UNIQUE NOT NULL,
       password TEXT NOT NULL
       )STRICT;
       `;

    const membersSchemaQuery = `
       CREATE TABLE IF NOT EXISTS members (
       memberId INTEGER PRIMARY KEY AUTOINCREMENT,
       name TEXT NOT NULL,
       email TEXT UNIQUE NOT NULL,
       password TEXT NOT NULL
       )STRICT;
       `;

    const booksSchemaQuery = `
       CREATE TABLE IF NOT EXISTS books (
       bookId INTEGER PRIMARY KEY AUTOINCREMENT,
       title TEXT NOT NULL,
       author TEXT NOT NULL,
       total INTEGER NOT NULL CHECK(total > 0),
       borrowed INTEGER DEFAULT 0 NOT NULL CHECK(borrowed >=0 AND borrowed <= total),
       UNIQUE(title, author)
       )STRICT;
       `;

    const bookTransSchemaQuery = `
       CREATE TABLE IF NOT EXISTS book_transactions (
       transactionId INTEGER PRIMARY KEY AUTOINCREMENT,
       bookId INTEGER REFERENCES books (bookId) ON DELETE CASCADE,
       memberId INTEGER REFERENCES members (memberId) ON DELETE CASCADE,
       borrowedAt TEXT NOT NULL,
       returnedAt TEXT
       )STRICT;
       `;

    this.#db.exec(adminsSchemaQuery);
    this.#db.exec(membersSchemaQuery);
    this.#db.exec(booksSchemaQuery);
    this.#db.exec(bookTransSchemaQuery);

    return this.findTables();
  }

  createMember({ name, email, password }) {
    const query = "INSERT INTO members (name, email, password) VALUES (?,?,?)";
    return this.#db.prepare(query).run(name, email, password);
  }

  findMemberById({ memberId }) {
    const query = "SELECT * FROM members WHERE memberId=?";
    return this.#db.prepare(query).get(memberId);
  }

  findMemberByEmail({ email }) {
    const query = "SELECT * FROM members WHERE email=?";
    return this.#db.prepare(query).get(email);
  }

  findMemberByEmailAndPassword({ email, password }) {
    const query = "SELECT * FROM members WHERE email=? AND password=?";
    return this.#db.prepare(query).get(email, password);
  }

  findAllMembers() {
    const query = "SELECT * FROM members";
    return this.#db.prepare(query).all();
  }

  createAdmin({ name, email, password }) {
    const query = "INSERT INTO admins (name, email, password) VALUES (?,?,?)";
    return this.#db.prepare(query).run(name, email, password);
  }

  findAdminById({ adminId }) {
    const query = "SELECT * FROM admins WHERE adminId=?";
    return this.#db.prepare(query).get(adminId);
  }

  findAdminByEmail({ email }) {
    const query = "SELECT * FROM admins WHERE email=?";
    return this.#db.prepare(query).get(email);
  }

  findAdminByEmailAndPassword({ email, password }) {
    const query = "SELECT * FROM admins WHERE email=? AND password=?";
    return this.#db.prepare(query).get(email, password);
  }

  createBook({ title, author, total }) {
    const query = "INSERT INTO books (title, author, total) VALUES (?,?,?)";
    return this.#db.prepare(query).run(title, author, total);
  }

  findBookById({ bookId }) {
    const query = "SELECT * FROM books WHERE bookId=?";
    return this.#db.prepare(query).get(bookId);
  }

  findBookByTitleAndAuthor({ title, author }) {
    const query = "SELECT * FROM books WHERE title=? AND author=?";
    return this.#db.prepare(query).get(title, author);
  }

  findAllBooks() {
    const query = "SELECT * FROM books";
    return this.#db.prepare(query).all();
  }

  deleteBook({ bookId }) {
    const query = "DELETE FROM books WHERE bookId=?";
    return this.#db.prepare(query).run(bookId);
  }

  updateBookQuantity({ bookId, quantity }) {
    const query = "UPDATE books SET total=? WHERE bookId=?";
    return this.#db.prepare(query).run(quantity, bookId);
  }

  borrowBook({ bookId, memberId }) {
    const date = new Date();
    const book = this.findBookById({ bookId });
    const updateBookQuery = "UPDATE books SET borrowed=? WHERE bookId=?";
    const insertTransQuery =
      "INSERT INTO book_transactions (bookId, memberId, borrowedAt) VALUES (?,?,?)";

    try {
      this.#db.exec("BEGIN");
      this.#db.prepare(updateBookQuery).run(book.borrowed + 1, bookId);
      const trans = this.#db.prepare(insertTransQuery).run(
        bookId,
        memberId,
        date.toLocaleString(),
      );
      this.#db.exec("COMMIT");
      return trans;
    } catch {
      this.#db.exec("ROLLBACK");
      return {};
    }
  }

  findBorrowedBooksByMemberId({ memberId }) {
    const query =
      `SELECT transactionId, bookId, title, author, memberId FROM book_transactions
    INNER JOIN books USING(bookId)
    WHERE memberId=? AND returnedAt IS NULL`;

    return this.#db.prepare(query).all(memberId);
  }

  findTransactionById({ transactionId }) {
    const query = "SELECT * FROM book_transactions WHERE transactionId=?";
    return this.#db.prepare(query).get(transactionId);
  }

  returnBook({ transactionId }) {
    const date = new Date();
    const { bookId } = this.findTransactionById({ transactionId });
    const book = this.findBookById({ bookId });
    const updateBookQuery = "UPDATE books SET borrowed=? WHERE bookId=?";
    const updateTransQuery =
      "UPDATE book_transactions SET returnedAt=? WHERE transactionId=?";

    try {
      this.#db.exec("BEGIN");
      this.#db.prepare(updateBookQuery).run(book.borrowed - 1, bookId);
      const trans = this.#db.prepare(updateTransQuery).run(
        date.toLocaleString(),
        transactionId,
      );
      this.#db.exec("COMMIT");
      return trans;
    } catch {
      this.#db.exec("ROLLBACK");
      return {};
    }
  }
}
