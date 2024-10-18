import { procedure, router } from "../trpc";

import { PrismaClient } from "@prisma/client";
import {z} from "zod";

const prisma = new PrismaClient();

export const goalsRouter = router({
  getGoalsByCategoryIdentifier: procedure
      .input(z.object({
          identifier: z.string(),
          year: z.string(),
      }))
      .query(async ({input}) => {
        const { identifier } = input;
        const { year } = input;

        const category = await prisma.categories.findFirst({
          where: {
            identifier: identifier
          }
        });

        if (category) {
          return prisma.goals.findMany({
            where: {
              category_id: category.id,
              year: Number(year)
            }
          });
        }

        return [];
      }),
    getGoalsByYear: procedure
        .input(z.object({ year: z.string() }))
        .query(async ({ input }) => {
            return prisma.goals.findMany({
                where: { year: Number(input.year) },
                include: {
                    category: true
                }
            });
        }),

    updateGoal: procedure
        .input(z.object({
            id: z.number(),
            name: z.string(),
            description: z.string(),
            current_value: z.number(),
            target: z.number(),
        }))
        .mutation(async ({ input }) => {
            return prisma.goals.update({
                where: { id: input.id },
                data: input,
            });
        }),

    createGoal: procedure
        .input(z.object({
            category_id: z.number(),
            unit_id: z.number().nullable(),
            name: z.string(),
            description: z.string(),
            type: z.enum(['incremental', 'decremental']),
            year: z.number(),
            current_value: z.number(),
            target: z.number(),
        }))
        .mutation(async ({ input }) => {
            return prisma.goals.create({
                data: input,
            });
        }),

    deleteGoal: procedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
            return prisma.goals.delete({
                where: { id: input.id },
            });
        }),
    getUnits: procedure.query(async () => {
        return prisma.units.findMany();
    }),
});
