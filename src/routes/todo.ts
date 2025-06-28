import { Router } from "express";
import prisma from "../db/prismaClient";

const router = Router();

// GET /todos - Tüm görevleri getir
router.get("/", async (req, res) => {
  const todos = await prisma.todo.findMany();
  res.json(todos);
});

// routes/todo.ts içinde
router.post("/", async (req, res) => {
  const { title } = req.body;
  const todo = await prisma.todo.create({
    data: { title },
  });
  res.status(201).json(todo);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {completed } = req.body;

  const updated = await prisma.todo.update({
    where: { id: Number(id) },
    data: { completed },
  });

  res.json(updated);
});

router.get("/:id", async (req, res) => {
   const { id } = req.params;

  const todo = await prisma.todo.findUnique({
    where: { id: Number(id) },
  });

  if (!todo) {
    return res.status(404).json({ message: "Görev bulunamadi" });
  }

  res.json(todo);
});

// Belirli bir todo'yu id'ye göre sil
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const deletedTodo = await prisma.todo.delete({
      where: { id },
    });

    res.json({ message: "Todo başariyla silindi", deletedTodo });
  } catch (error) {
    res.status(404).json({ message: "Todo bulunamadi veya silinemedi." });
  }
});



export default router;
