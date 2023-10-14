import { TRPCError, initTRPC } from "@trpc/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prismadb from "@/lib/prismadb";

const t = initTRPC.create();

const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
  const { getUser } = getKindeServerSession();

  const user = getUser();

  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const dbUser = await prismadb.user.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!dbUser) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      userId: dbUser.id,
      user,
    },
  });
});

export const router = t.router;

export const publicProcedure = t.procedure; //Means a public route, Anyone can call it even if a user is not authenticated.

export const privateProcedure = t.procedure.use(isAuth); //Means a private route, User have to be authenticated.
