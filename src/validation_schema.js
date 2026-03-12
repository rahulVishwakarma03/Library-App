import * as z from "zod";

export const regSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const bookSchema = z.object({
  title: z.string(),
  author: z.string(),
  total: z.int().min(1),
});

export const bookIdSchema = z.object({
  bookId: z.int().min(1),
});

export const transIdSchema = z.object({
  transactionId: z.int().min(1),
});

export const updateQuantitySchema = z.object({
  bookId: z.int().min(1),
  quantity: z.int().min(1),
});
