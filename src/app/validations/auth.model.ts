import { z } from "zod";

export const AddItemBodyRequestSchema = z.object({
  id: z.number(),
  quantity: z.number().min(1),
});

export type AddItemBodyRequestSchema = z.infer<
  typeof AddItemBodyRequestSchema
>;