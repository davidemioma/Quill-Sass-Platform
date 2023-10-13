import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

export const router = t.router;

export const publicProcedure = t.procedure; //Means a public route, Anyone can call it even if a user is not authenticated
