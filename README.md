### LIBRARY APP 

### TOP LEVEL WORKING

*** Customer ***

  * Register -> Enter details (customerName, email, password)
  * Login -> Books(disabled means unavailable books) -> Select book -> borrow the book
          -> Reading -> Select book -> return the book

*** Admin ***
  * Login -> Add new book -> Enter details (title, author, totalCopies)
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
