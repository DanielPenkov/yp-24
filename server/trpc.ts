import { initTRPC } from "@trpc/server";

type Context = {};

const trpc = initTRPC.context<Context>().create();

export const router = trpc.router;
export const procedure = trpc.procedure;

export type AppRouter = typeof router;
export type Procedure = typeof procedure;