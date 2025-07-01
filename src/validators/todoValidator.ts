import { z } from "zod";


export const todoIdParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, "id sayısal olmalı"),
});


export const createTodoSchema = z.object({
  title: z.string().min(1, "Başlık boş olamaz"),
  priority: z.enum(["low", "medium", "high"], {
    errorMap: () => ({ message: "Geçerli bir öncelik seçin" }),
  }),
});


export const updateTodoSchema = z.object({
  title: z.string().min(1, "Başlık boş olamaz"),
  completed: z.boolean().optional(),
  priority: z.enum(["low", "medium", "high"]),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
