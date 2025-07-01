import prisma from "../config/prisma";

// Listeleme servisi
export const getTodosByUserIdService = async (
  userId: number,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const total = await prisma.todo.count({ where: { userId } });

  const data = await prisma.todo.findMany({
    where: { userId },
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data,
  };
};

// Ekleme servisi
export const createTodoService = async ({
  userId,
  title,
  priority,
}: {
  userId: number;
  title: string;
  priority: "low" | "medium" | "high";
}) => {
  return await prisma.todo.create({
    data: {
      title,
      completed: false,
      priority,
      user: {
        connect: { id: userId },
      },
    },
  });
};

// Güncelleme servisi
export const updateTodoService = async (id: number, completed: boolean, title: string, priority: "low"|"medium"|"high" ) => {
  return await prisma.todo.update({
    where: { id },
    data: { completed,
      title,
      priority,
    },
  });
};




// Tekil veri çekme
export const getTodoByIdService = async (id: number) => {
  return await prisma.todo.findUnique({ where: { id } });
};

// Silme servisi
export const deleteTodoService = async (id: number) => {
  return await prisma.todo.delete({ where: { id } });
};
