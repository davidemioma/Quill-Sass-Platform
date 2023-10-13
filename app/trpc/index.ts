import z from "zod";
import prismadb from "@/lib/prismadb";
import { TRPCError } from "@trpc/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();

    const user = getUser();

    if (!user.id || !user.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    //Check if the user exists in the database
    const dbUser = await prismadb.user.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!dbUser) {
      //Create a new user
      await prismadb.user.create({
        data: {
          userId: user.id,
          email: user.email,
        },
      });
    }

    return { success: true };
  }),

  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return await prismadb.file.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  deleteFile: privateProcedure
    .input(z.object({ fileId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const { fileId } = input;

      const file = await prismadb.file.findUnique({
        where: {
          id: fileId,
          userId,
        },
      });

      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await prismadb.file.delete({
        where: {
          id: fileId,
          userId,
        },
      });

      return { success: true };
    }),
});

export type AppRouter = typeof appRouter;
