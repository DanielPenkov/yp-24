import { procedure, router } from "../trpc";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import {Goal, Unit} from "types/models";
import {CreateGoalInput, UpdateGoalInput} from "types/inputs";

const prisma = new PrismaClient();

export const goalsRouter = router({
  getGoalsByCategoryIdentifier: procedure
    .input(
      z.object({
        identifier: z.string(),
        year: z.string(),
      }),
    )
    .query(async ({ input }): Promise<Goal[]> => {
      const { identifier } = input;
      const { year } = input;

      const category = await prisma.categories.findFirst({
        where: {
          identifier: identifier,
        },
      });

      if (category) {
        return prisma.goals.findMany({
          where: {
            category_id: category.id,
            year: Number(year),
          },
        });
      }

      return [];
    }),

  getGoalsByYear: procedure
    .input(z.object({ year: z.string() }))
    .query(async ({ input }): Promise<Goal[]> => {
      return prisma.goals.findMany({
        where: { year: Number(input.year) },
        include: {
          category: true,
        },
      });
    }),

  updateGoal: procedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        current_value: z.number(),
        target: z.number(),
        unit_id: z.number().nullable(),
      }),
    )
    .mutation(async ({ input }: { input: UpdateGoalInput }): Promise<Goal> => {
      return prisma.goals.update({
        where: { id: input.id },
        data: input,
      });
    }),

  createGoal: procedure
    .input(
      z.object({
        category_id: z.number(),
        unit_id: z.number().nullable(),
        name: z.string(),
        description: z.string(),
        type: z.enum(["incremental", "decremental"]),
        year: z.number(),
        current_value: z.number(),
        target: z.number(),
      }),
    )
    .mutation(async ({ input }: { input: CreateGoalInput }): Promise<Goal> => {
      return prisma.goals.create({
        data: input,
      });
    }),

  deleteGoal: procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }): Promise<Goal> => {
      return prisma.goals.delete({
        where: { id: input.id },
      });
    }),

  getUnits: procedure.query(async (): Promise<Unit[]> => {
    return prisma.units.findMany();
  }),
});
