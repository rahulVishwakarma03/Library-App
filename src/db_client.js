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
       total INTEGER NOT NULL,
       available INTEGER NOT NULL,
       UNIQUE(title, author)
       )STRICT;
       `;

    const borrowsSchemaQuery = `
       CREATE TABLE IF NOT EXISTS borrows (
       bookId INTEGER REFERENCES book (bookId) ON DELETE CASCADE,
       memberId INTEGER REFERENCES member (memberId) ON DELETE CASCADE,
       borrowedAt TEXT DEFAULT CURRENT_TIMESTAMP
       )STRICT;
       `;

    this.#db.exec(adminsSchemaQuery);
    this.#db.exec(membersSchemaQuery);
    this.#db.exec(booksSchemaQuery);
    this.#db.exec(borrowsSchemaQuery);

    return this.findTables();
  }

  createMember({ name, email, password }) {
    const query = "INSERT INTO members (name, email, password) VALUES (?,?,?)";
    return this.#db.prepare(query).run(name, email, password);
  }
}
