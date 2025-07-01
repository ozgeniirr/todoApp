import { Request, Response } from "express";
import {
  getTodosByUserIdService,
  createTodoService,
  updateTodoService,
  getTodoByIdService,
  deleteTodoService
} from "../services/todo.service";

import { createTodoSchema, todoIdParamsSchema, updateTodoSchema } from "../validators/todoValidator";

export const getAllTodos = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 2;

  try {
    const result = await getTodosByUserIdService(userId, page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Görevler alınamadı", error });
  }
};

export const createTodo = async (req: Request, res: Response): Promise<any> => {
  const userId = (req as any).userId;
  const parsed = createTodoSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation error",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { title, priority } = parsed.data;

  try {
    const newTodo = await createTodoService({
      userId,
      title,
      priority,
    });

    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: "Görev eklenemedi", error });
  }
};

export const updateTodo = async (req: Request, res: Response):Promise<any> => {
  const id = Number(req.params.id);

  if (!req.body || typeof req.body.completed === "undefined") {
  return res.status(400).json({ message: "completed alanı eksik veya hatalı." });
}
  const { completed } = req.body;
  const parsed = updateTodoSchema.safeParse(req.body);

  if(!parsed.success){
    return res.status(400).json({
      message:"Validation error",
      errors: parsed.error.flatten().fieldErrors,

    });
  }

  const {title, priority} = parsed.data;
    

  try {
    const updated = await updateTodoService(id, completed, title, priority);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Güncelleme hatası", error });
  }
};

export const getTodoById = async (req: Request, res: Response): Promise<any> => {
  const parsed = todoIdParamsSchema.safeParse(req.params);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Geçersiz ID",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const id = parsed.data.id;

  try {
    const todo = await getTodoByIdService(Number(id));

    if (!todo) {
      return res.status(404).json({ message: "Görev bulunamadı" });
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: "Hata oluştu", error });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const deleted = await deleteTodoService(id);
    res.json({ message: "Silindi", deleted });
  } catch (error) {
    res.status(404).json({ message: "Silinemedi", error });
  }
};
