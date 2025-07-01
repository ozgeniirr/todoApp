/*import { Router, Request, Response } from "express";
import prisma from "../db/prismaClient";
import { authMiddleware } from "../middleware/authMiddleware";
import { createTodoSchema, todoIdParamsSchema
 } from "../utils/validators/todoValidator";
import { resourceLimits } from "worker_threads";


const router = Router();


router.get("/search", authMiddleware, async(req: Request, res:Response): Promise<any> =>{
  const userId =(req as any ).userId;

  const query = req.query.q as string ;

  if(!query || query.trim()=== ""){
    return res.status(400).json({message:"Arama terimi (q) gerrekli"});
  }
  try{
    const result = await prisma.todo.findMany({
      where: {
        userId,
        title:{
          contains: query,
          mode: "insensitive"

        },
      },
       orderBy: { createdAt: "desc" },
    }) ;

    if(result.length===0){
      return res.status(400).json({message:"Listede böyle bir alan bulunmamaktadır."})
    }

    res.json({
      total: result.length,
      data: result,
    });


  }catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error });
  }

});
router.get("/completed", authMiddleware, async( req: Request, res: Response ): Promise<any> =>{
      const userId = (req as any).userId

const page = parseInt(req.query.page as string ) || 1;
const limit = parseInt(req.query.limit as string) ||2;

const skip = (page -1)* limit;


  try {
  const total = await prisma.todo.count({where :{ userId , completed : true} });

    const completedTodos = await prisma.todo.findMany({
      where: {
        userId,
        completed: true
      },
      skip,
      take : limit,
      orderBy: { createdAt: "desc" },
    });

    res.json({
      page,
      limit,
      totalPages: Math.ceil(total/limit),
      total: completedTodos.length,
      data: completedTodos,
    });
}catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error });

}});

// ✅ Tüm görevleri getir (sadece giriş yapan kullanıcıya ait)
router.get("/", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string)|| 2;
  const completed = req.query.completed === "true";

  const whereCloused = completed ? {userId, completed:true} : {userId}
  const skip = (page -1)* limit;

   const total = await prisma.todo.count({where: whereCloused});



  const todos = await prisma.todo.findMany({
    where: whereCloused,
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



export default router;*/
