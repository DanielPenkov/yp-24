import { procedure, router } from "../trpc";
import { Prisma, PrismaClient } from "@prisma/client";
import { Goal, Result } from "types/models";
import { z } from "zod";
import Decimal = Prisma.Decimal;

const prisma = new PrismaClient();

export const resultsRouter = router({
  getGoalExpectedValues: procedure
    .input(
      z.object({
        ids: z.array(z.number()),
      }),
    )
    .query(async ({ input }): Promise<Record<number, number>> => {
      const { ids } = input;

      const results: Record<number, number> = {};

      for (const id of ids) {
        const goal = (await prisma.goals.findUnique({
          where: { id },
        })) as Goal | null;

        const goalInitialRecord = (await prisma.results.findFirst({
          where: { goal_id: id },
          orderBy: { date: "asc" },
        })) as Result | null;

        if (goalInitialRecord && goal) {
          const currentMonth = new Date().getMonth();
          const yearCompleted: number = currentMonth / 12;

          const target: number = (goal.target as Decimal).toNumber();

          if (goal.type === "decremental") {
            const goalInitialValue: number = goalInitialRecord.value
              ? goalInitialRecord.value.toNumber()
              : 0.0;

            results[id] = Math.ceil(
              goalInitialValue - (goalInitialValue - target) * yearCompleted,
            );
          } else {
            results[id] = Math.ceil(target * yearCompleted);
          }
        } else {
          results[id] = 0;
        }
      }
      return results;
    }),
  addData: procedure
    .input(
      z.object({
        goal_id: z.number(),
        value: z.number(),
        date: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;

      try {
        const latestRecord = (await prisma.results.findFirst({
          where: { goal_id: input.goal_id },
          orderBy: { date: "desc" },
        })) as Result | null;

        await prisma.results.create({
          data: {
            date: new Date(input.date),
            value: input.value,
            goal_id: input.goal_id,
          },
        });

        if (latestRecord && latestRecord.date < new Date(input.date)) {
          await prisma.goals.update({
            where: { id: input.goal_id },
            data: { current_value: input.value },
          });
        }
      } catch (e) {
        console.log(e);
      }
    }),
});
