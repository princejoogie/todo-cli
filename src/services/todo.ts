import prisma, { Prisma } from "../lib/prisma";

const getAll = async () => {
  return await prisma.todo.findMany();
};

const create = async (body: Prisma.TodoCreateInput) => {
  return await prisma.todo.create({
    data: body,
  });
};

export const todoService = {
  getAll,
  create,
};
