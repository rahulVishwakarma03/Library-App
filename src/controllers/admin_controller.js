import { loginAdmin, registerAdmin } from "../services/admin_service.js";
import { isString, validateInputType } from "../utils/utils.js";

export const registerAdminController = async (c) => {
  const dbClient = c.get("dbClient");
  const { name, email, password } = await c.req.json();
  validateInputType({ name, email, password }, isString);
  const res = registerAdmin(dbClient, { name, email, password });

  return c.json(res, 201);
};

export const loginAdminController = async (c) => {
  const dbClient = c.get("dbClient");
  const { email, password } = await c.req.json();
  validateInputType({ email, password }, isString);
  const res = loginAdmin(dbClient, { email, password });

  c.header("set-cookie", `adminId=${res.data.adminId}`);
  return c.json(res, 200);
};
