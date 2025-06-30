import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(3).max(30),
});
export const todoIdParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, "id sayısal olmalı"),
});
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
