import { categoriesRouter } from "./routers/categories";
import { router } from "./trpc";
import {resultsRouter} from "@/server/routers/results";
import {overviewRouter} from "@/server/routers/overview";

export const appRouter = router({
  categories: categoriesRouter,
  results: resultsRouter,
  overview: overviewRouter
});

export type AppRouter = typeof appRouter;
