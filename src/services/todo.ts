import prisma, { Prisma } from "../lib/prisma";

const getAll = async () => {
  return await prisma.todo.findMany();
};

const create = async (params: Prisma.TodoCreateInput) => {
  return await prisma.todo.create({
    data: params,
  });
};

const deleteById = async (params: Prisma.TodoDeleteArgs) => {
  return await prisma.todo.delete(params);
};

const deleteAll = async () => {
  return await prisma.todo.deleteMany();
};

const toggle = async ({ id, done }: { id: string; done: boolean }) => {
  return await prisma.todo.update({
    where: { id },
    data: { done: !done },
  });
};

export const todoService = {
  getAll,
  create,
  deleteAll,
  deleteById,
  toggle,
};
