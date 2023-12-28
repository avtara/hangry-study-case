import { z } from "zod";

export const RegisterBodyRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(3),
});

export const LoginBodyRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterBodyRequestSchema = z.infer<
  typeof RegisterBodyRequestSchema
>;
export type LoginBodyRequestSchema = z.infer<typeof LoginBodyRequestSchema>;
