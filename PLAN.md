### LIBRARY APP 

### TOP LEVEL WORKING

*** Customer ***

  * Register (customerName, email, password)
  * Login -> Books(disable the unavailable books) -> Select book -> borrow the book
          -> Reading -> Select book -> return the book

*** Admin ***
  * Login -> Add new book
          -> list All books
          -> Manage Book -> select a book -> update quantity
                                          -> delete book
                                          -> view details


  steps : 
    * customer chooses a command and provide the required details
    * command goes to agent
    * server gets the request
    * server handle the request
    * sends the response to the agent
    * agent handles the response
    * display response to the customer

### Server 
  * it takes the port to listen on that port.
  * it receives the request from agent and process send to the library Manager to fullfil the request.
  * after processing the request it sends the response to the agent.

### Agent
  * agent takes hostname and port to connect to server.
  * After establishing the connection between client and server , it take the request from client and send to the server.
  * receives response from the server and send to the client. 

### Top Level Functions for different features

  *** Customer tasks ***
  ✅  -> registerCustomer(name,email, password) // returns {success:true}
  ✅  -> loginCustomer(email, password) // returns {success : true/false}
  ✅  -> listBooks()// returns all books
  ✅  -> listBorrowed(customerId) // returns books borrowed by the customer itself
  ✅  -> borrowBook(customerId, bookId) // returns {success : true/false}
  ✅  -> returnBook(customerId, bookId) // returns {success : true/false}

  *** Admin tasks ***
  ✅  -> registerAdmin(name,email, password) // returns {success:true}
  ✅  -> loginAdmin(email, password) // returns {success : true/false}
  ✅  -> listBooks()// returns all books
      -> listCustomers()// returns all customers
  ✅  -> AddBook(title, author, totalQuantity){id, available is default} // returns {success : true}
  ✅  -> viewBook(bookId) // return {title, author, total, available}
  ✅   -> updateQuantity(bookId, quantity) // returns {success : true};
  ✅  -> deleteBook(bookId) // returns {success : true}

### In_Memory Structure
  
  * Use a object with two pair customers and books. Both should be an array where it should store the object as it's entries , in case of customers array it should store the customer details and for books array it should store books details.

  example : 

  {
    admin : {
      name : adminName,
      email : emailId,
      password : password
    }
    customers : [
      { customerId : default id,
        name : customerName,
        email : emailId,
        password : password,
        borrowed : [{
          bookId : bookId
          title : bookName,
          author : authorName
          },{},..]
      }
    ]

    books : [
      {
        bookId : default id,
        title : BookName,
        author : authorName,
        total : totalCopies,
        available : TotalAvailableCopies
      }, {},....
    ]
  }

### LibraryManager
    * it binds the memoryStructure/sqliteDb and features into a class
    * class will have a libraryStructure as property and methods for each feature.
    * constructor will take the structure of library and initialize the Library structure.

    class Library {
      constructor(library){}
      registerUser(name, email, password){}
      ...
    }


### TYPES OF ERROR
  * 400 : Validation Error (invalid format of name,email, password,title )
  * 401 : Authentication Error (wrong credential)
  * 404 : Not Found Error (customerId, bookId)
  * 409 : Conflict Error (already Exists, insufficient copies)
  * 500 : Server Error  (db connection failed)

### Status Codes For success
  * 200 : mainly used for get(ex : list books, list borrowed, borrow, return) 
  * 201 : mainly used for post(ex : registerCustomer, registerAdmin, addBook) // return the id or object
  * 204 : mainly used for put ( eg : removeBook, updateQuantity); // body is not expected



### ERROR HANDLING

  ## Create custom Error class 
    * AppError extends Error class
    * ValidationError extends AppError
    * Authentication extends AppError
    * NotFoundError extends AppError
    * ConflictError extends AppError
    * ServerError extends AppError

  ***registerCustomer**
    `1` validate params data type (string, number, undefined)
    `2` check whether customer already exists or not  // doesCustomerExist(email)

  ***registerAdmin**
    `1` validate params data type (string, number, undefined)
    `2` check whether admin already exists or not // doesAdminExists()
  
  ***loginCustomer**
    `1` validate params data type (string, number, undefined)
    `2` check whether customer exists or not  // doesCustomerExist(email, password)
  
  ***loginAdmin**
    `1` validate params data type (string, number, undefined)
    `2` check whether admin exists or not   // doesAdminExist(email, password)
  
  ***addBook**
    `1` validate params data type (string, number, undefined)
    `2` check whether book already exists or not // doesBookExist(title, author)

  ***viewBook**
    `1` validate params data type (string, number, undefined);
    `2` check whether bookId is correct or not  // doesBookExist(bookId)

  ***removeBook**
    `1` validate params data type (string, number, undefined);
    `2` check whether bookId is correct or not  // doesBookExist(bookId)
  
  ***updateQuantity**
    `1` validate params data type (string, number, undefined);
    `2` check whether bookId is correct or not  // doesBookExist(bookId)
  
  ***borrowBook**
    `1` validate params data type (string, number, undefined);
    `2` check whether bookId and customerId is correct or not // doesCustomerExist(customerId) doesBookExist(bookId)
  
  ***returnBook**
    `1` validate params data type (string, number, undefined);
    `2` check whether bookId and customerId is correct or not  // doesCustomerExist(customerId) doesBookExist(bookId)


### USER INTERFACE

Customer -> register -> Enter name , email, password
         -> login (Enter email, password)
                    -> Books -> book1
                             -> book2 -> borrow
                                      -> back
                             -> book3 (disabled when no copy available)

                    -> Reading -> book1
                               -> book2 -> return
                                        -> back
                               -> book3
                    -> Exit

Admin -> login -> Add new book
               -> List All books
               -> Manage Book ->list -> view 
                                     -> update copies quantity 
                                     -> Remove book
                                     -> back
               -> List All customers
               -> Exit