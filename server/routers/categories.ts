import { procedure, router } from "../trpc";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const categoriesRouter = router({
  getCategoriesWithGoals: procedure.query(async () => {
    return prisma.categories.findMany({
      include: {
        goals: true,
      }
    });
  }),
  getCategories: procedure.query(async () => {
    return prisma.categories.findMany();
  }),
});
