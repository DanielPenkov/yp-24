import { procedure, router } from "../trpc";

import { PrismaClient } from "@prisma/client";
import {z} from "zod";

const prisma = new PrismaClient();

export const goalsRouter = router({
  getGoalsByCategoryIdentifier: procedure.input(z.object({ identifier: z.string() }))
      .query(async ({input}) => {
        const { identifier } = input;

        const category = await prisma.categories.findFirst({
          where: {
            identifier: identifier
          }
        });

        if (category) {
          return prisma.goals.findMany({
            where: {
              category_id: category.id
            }
          });
        }

        return [];
      }),
});
