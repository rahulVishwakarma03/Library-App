import * as z from "zod";

export const regSchema = z.object({
  name: z.string().nonempty(),
  email: z.email(),
  password: z.string().nonempty(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().nonempty(),
});

export const bookSchema = z.object({
  title: z.string().nonempty(),
  author: z.string().nonempty(),
  total: z.int().min(1),
});

export const bookIdSchema = z.object({
  bookId: z.int(),
});

export const transIdSchema = z.object({
  transactionId: z.int(),
});

export const updateQuantitySchema = z.object({
  bookId: z.int(),
  quantity: z.int().min(1),
});
