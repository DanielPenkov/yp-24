import { procedure, router } from "../trpc";
import { z } from 'zod';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resultsRouter = router({
    getGoalInitialRecord: procedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            const { id } = input;


            const goal = await prisma.goals.findUnique({
                where: {
                    id: id
                }
            });



            const goalInitialRecord =  await prisma.results.findFirst({
                where: {
                    goal_id: id
                },
                orderBy: {
                    date: 'asc'
                }
            });

            if (goalInitialRecord && goal) {
                const now = new Date();
                const start = new Date(now.getFullYear(), 0, 0);
                // @ts-ignore
                const diff = now - start;
                const oneDay = 1000 * 60 * 60 * 24;
                const day = Math.floor(diff / oneDay);
                const yearCompleted: number = day / 365;
                const target: number = goal.target.toNumber()

                if (goal.type === "decremental") {
                    const goalInitialValue: number = goalInitialRecord ? (goalInitialRecord.value ? goalInitialRecord.value.toNumber() : 0.00) : 0.00;

                    return goalInitialValue - ((goalInitialValue - target) * yearCompleted);
                }

                return target * yearCompleted;
            }
        }),
});
