import { procedure, router } from "../trpc";
import { z } from 'zod';

import { PrismaClient } from "@prisma/client";
import {opt} from "ts-interface-checker";

const prisma = new PrismaClient();

export const resultsRouter = router({
    getGoalExpectedValue: procedure
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
                const currentMonth = new Date().getMonth();
                const yearCompleted: number = currentMonth / 12;

                const target: number = goal.target.toNumber();

                if (goal.type === "decremental") {
                    const goalInitialValue: number = goalInitialRecord ? (goalInitialRecord.value ? goalInitialRecord.value.toNumber() : 0.00) : 0.00;

                    return Math.ceil(goalInitialValue - ((goalInitialValue - target) * yearCompleted));
                }

                return Math.ceil(target * yearCompleted);
            }
        }),
    addData: procedure
        .input(z.object({
            goal_id: z.number(),
            value: z.number(),
            date: z.string()
        }))
        .mutation(async (opts) => {
            const {input } = opts;

            try {
                const latestRecord = await prisma.results.findFirst({
                    where: {
                        goal_id: input.goal_id
                    },
                    orderBy: {
                        date: 'desc',
                    },
                });

                await prisma.results.create({
                    data: {
                        date: new Date(input.date),
                        value: input.value,
                        goal_id: input.goal_id
                    }
                });

                if (latestRecord && latestRecord.date < new Date(input.date)) {
                    await prisma.goals.update({
                        where: {
                            id: input.goal_id
                        },
                        data: {
                            current_value: input.value
                        }
                    })
                }
            } catch (e) {
                console.log(e);
            }

        })
});
