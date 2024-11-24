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

function handleRequest(payload: { data: {
  metrics?: WebhookDataMetric[],
  workouts?: WebhookDataMetric[]
} }) {
  const metrics = payload.data.metrics;
  const workouts = payload.data.workouts ?? [];

  if (metrics) {
    metrics.forEach(function (metric) {
      if (metric.name === "weight_body_mass") {
        saveBodyWeight(metric).catch((error) => {
          console.error('Error saving body weight:', error);
        })
      }
    });
  }

  if (workouts) {
    workouts.forEach(function (workout) {
      saveWorkout(workout).catch((error) => {
        console.error('Error saving workout:', error);
      })
    })
  }
}

async function saveRun(metric: WebhookDataMetric) {
  const goal = await prisma.goals.findFirst({
    where: {
      name: "Running",
      year: Number(new Date().getFullYear().toString()),
    },
  });

  if (!goal) {
    throw new Error("Goal with name 'Running' not found");
  }

  if (!metric.start) {
    return;
  }

  const date = new Date(metric.start);
  const formattedDate = date.toISOString().split('T')[0];
  const recordExists = await checkExistingResultData(formattedDate, goal.id);

  if (recordExists) {
    return;
  }

  const latestRunningResult = await getLatestResult(goal.id)
  const latestRunningValue = latestRunningResult ? latestRunningResult.value : 0;

  await prisma.results.create({
    data: {
      date: new Date(metric.start),
      value: Number(latestRunningValue) + (metric.distance?.qty ?? 0),
      goal_id: goal.id,
    },
  });

  await prisma.goals.update({
    where: { id: goal.id },
    data: {
      current_value: Number(latestRunningValue) + (metric.distance?.qty ?? 0),
    },
  });
}

async function saveStrengthTraining(metric: WebhookDataMetric) {
  const goal = await prisma.goals.findFirst({
    where: {
      name: "Strength Training",
      year: Number(new Date().getFullYear().toString()),
    },
  });

  if (!goal) {
    throw new Error("Goal with name 'Strength Training' not found");
  }

  if (!metric.start) {
    return;
  }

  const date = new Date(metric.start);
  const formattedDate = date.toISOString().split('T')[0];
  const recordExists = await checkExistingResultData(formattedDate, goal.id);

  if (recordExists) {
    return;
  }

  if ((metric.duration ?? 0) < 1000) {
    return
  }

  const latestTrainingResult = await getLatestResult(goal.id)
  const latestTrainingValue = latestTrainingResult ? latestTrainingResult.value : 0;

  await prisma.results.create({
    data: {
      date: new Date(metric.start),
      value: Number(latestTrainingValue) + 1,
      goal_id: goal.id,
    },
  });

  await prisma.goals.update({
    where: { id: goal.id },
    data: {
      current_value: Number(latestTrainingValue) + 1,
    },
  });
}

async function saveWorkout(metric: WebhookDataMetric) {
  if (metric.name === "Outdoor Run") {
    saveRun(metric).catch(function (error) {
      console.error('Error saving run:', error);
    })
  } else if (metric.name === "Traditional Strength Training") {
    saveStrengthTraining(metric).catch(function (error) {
      console.error('Error saving strength training:', error);
    })
  }
}

async function saveBodyWeight(metric: WebhookDataMetric) {
  const goal = await prisma.goals.findFirst({
    where: {
      name: "Weight",
      year: Number(new Date().getFullYear().toString()),
    },
  });

  if (!metric.data) {
    return;
  }

  if (!goal) {
    throw new Error("Goal with name 'Weight' not found");
  }

  for (const item of metric.data) {
    const recordExists = await checkExistingResultData(item.date, goal.id);

    if (!recordExists) {
      prisma.results.create({
        data: {
          date: new Date(item.date),
          value: item.qty,
          goal_id: goal.id,
        },
      });

      await prisma.goals.update({
        where: { id: goal.id },
        data: {
          current_value: item.qty,
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

async function getLatestResult(goalId: number) {

  try {
    return prisma.results.findFirst({
      where: {
        goal_id: goalId,
      },
      orderBy: {
        date: 'desc'
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unknown error occurred");
    }
    return false;
  }
}

