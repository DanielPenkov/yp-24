import { categoriesRouter } from "./routers/categories";
import { router } from "./trpc";
import {resultsRouter} from "@/server/routers/results";
import {overviewRouter} from "@/server/routers/overview";
import {goalsRouter} from "@/server/routers/goals";

export const appRouter = router({
  categories: categoriesRouter,
  goals: goalsRouter,
  results: resultsRouter,
  overview: overviewRouter
});

export type AppRouter = typeof appRouter;
