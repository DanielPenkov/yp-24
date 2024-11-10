import { Prisma } from "@prisma/client";
import { trpc } from "@/server/client";
import { Goal, GoalData } from "types/models";
import { CategoryTableData } from "types/utils";

export const getGoalsByYear = (year: string): Goal[] => {
  const data = trpc.goals.getGoalsByYear.useQuery({ year: year });

  return formatGoals(data.data ?? []);
};

export const getGoalsByCategory = (
  categoryIdentifier: string,
  year: number,
): Goal[] => {
  const data = trpc.goals.getGoalsByCategoryIdentifier.useQuery({
    identifier: categoryIdentifier,
    year: year.toString(),
  });

  return formatGoals(data.data ?? []);
};

export function getGoalsCurrentValues(goals: Goal[]): Record<string, number> {
  let goalsCurrentValues: Record<string, number> = {};

  if (!goals) {
    return {};
  }

  goals.forEach((goal) => {
    goalsCurrentValues[goal.id.toString()] = Number(goal.current_value);
  });

  return goalsCurrentValues;
}

export async function refetchData(
  trpcContext: ReturnType<typeof trpc.useUtils>,
  identifier: string,
  year: string,
) {
  await trpcContext.overview.overview.invalidate({
    identifier,
    year,
  });
}

export async function refetchYearlyGoals(
    trpcContext: ReturnType<typeof trpc.useUtils>,
    year: string,
) {
  await trpcContext.goals.getGoalsByYear.invalidate({
    year,
  });
}


export const getOverviewData = (
  categoryIdentifier: string,
  year: string,
): { goals: Goal[]; tableData: CategoryTableData } => {
  const data = trpc.overview.overview.useQuery({
    identifier: categoryIdentifier,
    year: year,
  });

  return {
    tableData: data.data?.tableData ?? {},
    goals: formatGoals(data.data?.goals ?? []),
  };
};

//Todo: Add types
export const createGoalEntity = () => {
  return trpc.goals.createGoal.useMutation({});
};

//Todo: Add types
export const updateGoalEntity = () => {
  return trpc.goals.updateGoal.useMutation({});
};

export const formatGoals = (goals: GoalData[]): Goal[] => {
  return goals.map((goal) => ({
    ...goal,
    target: new Prisma.Decimal(goal.target ?? 0),
    current_target: goal.current_target
      ? new Prisma.Decimal(goal.current_target ?? 0)
      : undefined,
    current_value: new Prisma.Decimal(goal.current_value ?? 0),
    results: goal.results?.map((result) => ({
      ...result,
      date: new Date(result.date),
      value: result.value ? new Prisma.Decimal(result.value) : null,
    })),
  }));
};
