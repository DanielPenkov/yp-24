import { procedure, router } from "../trpc";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import {Category } from "types/modelTypes";

const prisma = new PrismaClient();
const YearInputSchema = z.object({ year: z.string() });

export const categoriesRouter = router({
  getCategoriesWithGoals: procedure
    .input(YearInputSchema)
    .query(async ({ input }): Promise<Category[]> => {
      const { year } = input;

      return prisma.categories.findMany({
        where: {
          goals: {
            some: {
              year: Number(year),
            },
          },
        },
        include: {
          goals: {
            where: {
              year: Number(year),
            },
          },
        },
      });
    }),
  getCategoriesByYear: procedure
    .input(YearInputSchema)
    .query(async ({ input }): Promise<Category[]> => {
      const { year } = input;

      return prisma.categories.findMany({
        where: {
          goals: {
            some: {
              year: Number(year),
            },
          },
        },
      });
    }),

  getCategories: procedure.query(async (): Promise<Category[]> => {
    return prisma.categories.findMany();
  }),
});
