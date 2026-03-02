export const listBorrowedBooks = (dbClient, { memberId }) => {
  // validateInputType({ memberId }, isInteger);

  const borrowedBooks = dbClient.findBorrowedBooksByMemberId({ memberId });
  return {
    success: true,
    data: { borrowedBooks },
    message: "Successful",
  };
};
