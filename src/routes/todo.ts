import { Router, Request, Response } from "express";
import prisma from "../db/prismaClient";
import { authMiddleware } from "../middleware/authMiddleware";
import { createTodoSchema, todoIdParamsSchema } from "../utils/validators/todoValidator";


const router = Router();

// ✅ Tüm görevleri getir (sadece giriş yapan kullanıcıya ait)
router.get("/", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string)|| 2;

  const skip = (page -1)* limit;

   const total = await prisma.todo.count({where :{ userId}});



  const todos = await prisma.todo.findMany({
    where: { userId },
    skip,
      take: limit,
      orderBy: { createdAt: "desc" }
  });

  res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: todos
});
});

// ✅ Yeni görev oluştur
router.post("/", authMiddleware, async (req: Request, res: Response): Promise<any> => {
  const userId = (req as any).userId;
  const parsed = createTodoSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation error",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const title = parsed.data.title;


  try {
    const newTodo = await prisma.todo.create({
      data: {
        title,
        completed: false, // default olarak tamamlanmamış
        user: { connect: { id: userId } }, // ilişkilendir
      },
    });

    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: "Görev eklenemedi", error });
  }
});

// ✅ Belirli görevi güncelle (tamamlandı bilgisi)
router.put("/:id", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    const updatedTodo = await prisma.todo.update({
      where: { id: Number(id) },
      data: { completed },
    });

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Güncelleme hatası", error });
  }
});

// ✅ Belirli görevi ID ile getir
router.get("/:id", authMiddleware, async (req: Request, res: Response): Promise<any> => {
  const parsed= todoIdParamsSchema.safeParse(req.params)

    if (!parsed.success) {
    return res.status(400).json({
      message: "Geçersiz ID",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const id = parsed.data.id;

  const todo = await prisma.todo.findUnique({
    where: { id: Number(id) },
  });

  if (!todo) {
    res.status(404).json({ message: "Görev bulunamadı" });
    return;
  }

  res.json(todo);
});

// ✅ Görevi sil
router.delete("/:id", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  try {
    const deletedTodo = await prisma.todo.delete({
      where: { id },
    });

    res.json({ message: "Görev silindi", deletedTodo });
  } catch (error) {
    res.status(404).json({ message: "Silinemedi", error });
  }
});

export default router;
