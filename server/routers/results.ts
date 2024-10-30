// resultsRouter.ts
import { procedure, router } from "../trpc";
import { PrismaClient } from "@prisma/client";
import {
  GetGoalExpectedValueInput,
  AddDataInput,
  Goal,
  Result,
  GetGoalExpectedValueOutput,
} from "types/modelTypes";
import { Decimal } from 'decimal.js';

const prisma = new PrismaClient();

export const resultsRouter = router({
  getGoalExpectedValue: procedure
    .input(GetGoalExpectedValueInput)
    .query<GetGoalExpectedValueOutput>(async ({ input }) => {
      const { id } = input;

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

          return Math.ceil(
            goalInitialValue - (goalInitialValue - target) * yearCompleted,
          );
        }

        return Math.ceil(target * yearCompleted);
      }
      return 0;
    }),
  addData: procedure.input(AddDataInput).mutation(async (opts) => {
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
