import prisma from "../config/prisma";

export const getTodosByUserIdService = async (userId: number, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const total = await prisma.todo.count({ where: { userId } });
  const todos = await prisma.todo.findMany({
    where: { userId },
    skip,
    take: limit,
    orderBy: { createdAt: "desc" }
  });

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: todos,
  };
};

export const createTodoService = async (userId: number, title: string) => {
  return prisma.todo.create({
    data: {
      title,
      completed: false,
      user: { connect: { id: userId } },
    },
  });
};

export const updateTodoService = async (id: number, completed: boolean) => {
  return prisma.todo.update({
    where: { id },
    data: { completed },
  });
};

export const getTodoByIdService = async (id: number) => {
  return prisma.todo.findUnique({ where: { id } });
};

export const deleteTodoService = async (id: number) => {
  return prisma.todo.delete({ where: { id } });
};
