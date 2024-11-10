import { trpc } from "@/server/client";
import { Category, CategoryData } from "types/models";
import { formatGoals } from "@/server/models/goals";

export const getCategoriesWithGoals = (year: string): Category[] => {
  const result = trpc.categories.getCategoriesWithGoals.useQuery({
    year: year,
  });

  if (result.data) {
    return formatCategories(result.data);
  }

  return [];
};

export const getAllCategories = (): Category[] => {
  const query = trpc.categories.getCategories.useQuery();

  if (query.data) {
    return formatCategories(query.data);
  }

  return [];
};

const formatCategories = (categories: CategoryData[]): Category[] => {
  return categories.map((category) => ({
    ...category,
    goals: category.goals ? formatGoals(category.goals) : [],
  }));
};
