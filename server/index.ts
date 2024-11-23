// Import your specific routers
import { categoriesRouter } from "./routers/categories";
import { router } from "./trpc";
import { resultsRouter } from "@/server/routers/results";
import { overviewRouter } from "@/server/routers/overview";
import { goalsRouter } from "@/server/routers/goals";
import {webhooksRouter} from "@/server/routers/webhooks-router";

// Define the structure of your appRouter with proper typing
export const appRouter = router({
  categories: categoriesRouter,
  goals: goalsRouter,
  results: resultsRouter,
  overview: overviewRouter,
  webhooks: webhooksRouter,
});

// Type definition for the complete AppRouter
export type AppRouter = typeof appRouter;