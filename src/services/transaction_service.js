export const listBorrowedBooks = (dbClient, { memberId }) => {
  const borrowedBooks = dbClient.findAllBorrowedBooksByMemberId({ memberId });
  return {
    success: true,
    data: { borrowedBooks },
    message: "Successful",
  };
};

export const listAllTransactions = (dbClient) => {
  const transactions = dbClient.findAllTransactions();
  return {
    success: true,
    data: { transactions },
    message: "Successful",
  };
};
