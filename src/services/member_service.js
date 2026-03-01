import { AuthenticationError, ConflictError } from "../utils/custom_errors.js";

export const registerMember = (dbClient, { name, email, password }) => {
  const existing = dbClient.findMemberByEmail({ email });
  if (existing) {
    throw new ConflictError("Member already exists");
  }

  const res = dbClient.createMember({ name, email, password });

  return {
    success: true,
    data: { adminId: res.lastInsertRowid },
    message: "Member Registered Successfully",
  };
};

export const loginMember = (dbClient, { email, password }) => {
  const member = dbClient.findMemberByEmailAndPassword({ email, password });

  if (!member) {
    throw new AuthenticationError("Wrong login details");
  }

  return {
    success: true,
    data: { memberId: member.memberId },
    message: "Member loggedIn Successfully",
  };
};

export const listMembers = (dbClient) => {
  const members = dbClient.findAllMembers();

  return {
    success: true,
    data: { members },
    message: "Successful",
  };
};
