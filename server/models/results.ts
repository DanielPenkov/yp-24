import { trpc } from "@/server/client";
import { Category } from "types/models";

export const addResult = () => {
  return trpc.results.addData.useMutation();
};

export function getExpectedGoalsValues(categories: Category[]) {
  const goalIds = categories
    .flatMap((category) => category.goals?.map((goal) => goal.id))
    .filter((id) => id !== undefined) as number[];

  return trpc.results.getGoalExpectedValues.useQuery({ ids: goalIds }).data || [];
}
