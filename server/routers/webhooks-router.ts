import { z } from "zod";
import { procedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { WebhookDataMetric } from "types/inputs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};

export const webhooksRouter = router({
  handleWebhook: procedure
    .input(
      z.object({
        data: z.any(),
      }),
    )
    .mutation(
      async ({
        input: payload,
        ctx,
      }: {
        input: any;
        ctx: { apiKey?: string };
      }) => {
        const storedApiKey = process.env.WEBHOOK_API_KEY_SECRET;

        if (ctx.apiKey !== storedApiKey) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Unauthorized",
          });
        }

        handleRequest(payload.data);

        return {
          success: true,
        };
      },
    ),
});

function handleRequest(payload: { data: { metrics: WebhookDataMetric[] } }) {
  const metrics = payload.data.metrics;

  metrics.forEach(function (metric) {
    if (metric.name === "weight_body_mass") {
      saveBodyWeight(metric).catch((error) => {
        console.error('Error saving body weight:', error);
      })
    }
  });
}

async function saveBodyWeight(metric: WebhookDataMetric) {
  const goal = await prisma.goals.findFirst({
    where: {
      name: "Weight",
      year: Number(new Date().getFullYear().toString()),
    },
  });

  if (!goal) {
    throw new Error("Goal with name 'Weight' not found");
  }

  for (const item of metric.data) {
    const recordExists = await checkExistingResultData(item.date, goal.id);

    if (!recordExists) {
      await prisma.results.create({
        data: {
          date: new Date(item.date),
          value: item.qty,
          goal_id: goal.id,
        },
      });
    }
  }
}

async function checkExistingResultData(date: string, goalId: number) {

  try {
    const result = await prisma.results.findFirst({
      where: {
        date: new Date(date),
        goal_id: goalId,
      },
    });

    return !!result;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unknown error occurred");
    }
    return false;
  }
}
