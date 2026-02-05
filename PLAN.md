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
    -> registerCustomer(name,email, password) // returns {success:true}
    -> loginCustomer(email, password) // returns {success : true/false}
    -> listBooks()// returns all books
    -> listReading(customerId) // returns books borrowed by the customer itself
    -> borrowBook(customerId, bookId) // returns {success : true/false}
    -> returnBook(customerId, bookId) // returns {success : true/false}

  *** Admin tasks ***
    -> registerAdmin(name,email, password) // returns {success:true}
    -> loginAdmin(email, password) // returns {success : true/false}
    -> AddBook(title, author, totalQuantity){id, available is default} // returns {success : true}
    -> viewBook(bookId) // return {title, author, total, available}
    -> updateQuantity(bookId) // returns {success : true};
    -> deleteBook(bookId) // returns {success : true}

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
      { userId : default id,
        name : customerName,
        email : emailId,
        password : password,
        borrowed : [{
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
        available : noOfAvailableCopies
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

### Error Codes

  * 401 : Already Exists
  * 402 : invalid login details
