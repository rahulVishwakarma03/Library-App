# 📚 Library Management System

## 📌 Overview

This is a simple Library Management System built using a multi-layer
architecture:

Frontend → API Gateway → Backend Services → Database

The system supports two roles:

- Admin
- Member

It allows managing books, borrowing/returning operations, and user
authentication.

---

# 🏗 High Level Architecture

```
Frontend  
   ↓
API Gateway  
   ↓
Backend Services  
   ↓
Database
```

## 1️⃣ Frontend

Responsible for:

- UI for Admin and Members
- Sending HTTP requests to API Gateway
- Handling responses and displaying data

## 2️⃣ API Gateway

Responsible for:

- Routing requests to correct backend service
- Authentication verification
- Request validation (basic level)

## 3️⃣ Backend Services

Responsible for:

- Constraint
- Database interaction
- Borrow/return rules
- Updating book availability

## 4️⃣ Database

Stores all persistent data:

- Books
- Members
- Admins
- Transactions

---

# 🚀 Features

## 👨‍💼 Admin Features

1. Register
2. Login
3. Add Book
4. Delete Book
5. Update Book Quantity
6. List All Books
7. List All Members

## 👤 Member Features

1. Register
2. Login
3. Borrow Book
4. Return Book
5. List All Books
6. List All Borrowed Books by Member

---

# 🗄 Database Schema

## 1️⃣ Books Table

**Columns:**

- bookId (Primary Key)
- title
- author
- total
- borrowed

**Constraints:**

- bookId → PRIMARY KEY
- UNIQUE(title, author)
- total > 0
- borrowed ≥ 0 AND <= total

---

## 2️⃣ Members Table

**Columns:**

- memberId (Primary Key)
- name
- email
- password

**Constraints:**

- memberId → PRIMARY KEY
- email → UNIQUE

---

## 3️⃣ Admins Table

**Columns:**

- adminId (Primary Key)
- name
- email
- password

**Constraints:**

- adminId → PRIMARY KEY
- email → UNIQUE

---

## 4️⃣ book_transactions Table

**Columns:**

- bookId (Foreign Key)
- memberId (Foreign Key)
- borrowedAt
- returnedAt

**Relationships:**

- bookId → REFERENCES Books(bookId)
- memberId → REFERENCES Members(memberId)
- borrowedAt -> NOT NULL

---

# 🔄 Core Workflow

## Borrow Book Flow

1. Member logs in.
2. Member selects a book.
3. System checks if book is available.
4. Create entry in book_transactions table.
5. Increase `borrowed` count by 1.

## Return Book Flow

1. Member selects borrowed book.
2. Update returnedAt column with current date.
3. Decrease `borrowed` count by 1.

---

# 🔐 Authentication

- Admin and Member authentication handled separately.
- Cookie is used for authentication

---
