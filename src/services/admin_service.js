import { AuthenticationError, ConflictError } from "../utils/custom_errors.js";

export const registerAdmin = (dbClient, { name, email, password }) => {
  const existingAdmin = dbClient.findAdminByEmail({ email });

  if (existingAdmin) {
    throw new ConflictError("Admin already exists");
  }

  const res = dbClient.createAdmin({ name, email, password });
  return {
    success: true,
    data: { adminId: res.lastInsertRowid },
    message: "Admin Registered Successfully",
  };
};

export const loginAdmin = (dbClient, { email, password }) => {
  const admin = dbClient.findAdminByEmailAndPassword({ email, password });

  if (!admin) {
    throw new AuthenticationError("Wrong login details");
  }

  return {
    success: true,
    data: { adminId: admin.adminId },
    message: "Admin loggedIn Successfully",
  };
};
