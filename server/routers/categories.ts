import { procedure, router } from "../trpc";

import { PrismaClient } from "@prisma/client";
import {z} from "zod";

const prisma = new PrismaClient();

export const categoriesRouter = router({
  getCategoriesWithGoals: procedure
      .input(z.object({ year: z.string() }))
      .query(async ({ input }) => {
        const { year } = input;

    return prisma.categories.findMany({
      where: {
        goals: {
          some: {
            year: Number(year)
          }
        }
      },
      include: {
        goals: {
          where: {
            year: Number(year)
          }
        },
      }
    });
  }),
  getCategoriesByYear: procedure
      .input(z.object({ year: z.string() }))
      .query(async ({ input }) => {
        const { year } = input;

        return prisma.categories.findMany({
          where: {
            goals: {
              some: {
                year: Number(year)
              }
            }
          },
        });
      }),
  getCategories: procedure.query(async () => {
    return prisma.categories.findMany();
  }),
});
