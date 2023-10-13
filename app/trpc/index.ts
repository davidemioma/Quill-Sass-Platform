import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./trpc";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const appRouter = router({
  authCallback: publicProcedure.query(() => {
    const { getUser } = getKindeServerSession();

    const user = getUser();

    if (!user || !user.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    //Check if the user exists in the database

    return { success: true };
  }),
});

export type AppRouter = typeof appRouter;