import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserSubscriptionPlan } from "../actions/getUserSubscriptionPlan";

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession();

  const user = getUser();

  if (!user || !user.id) {
    return redirect("/auth-callback?origin=dashboard");
  }

  const dbUser = await prismadb.user.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!dbUser) {
    return redirect("/auth-callback?origin=dashboard");
  }

  const subscriptionPlan = await getUserSubscriptionPlan();

  return <Dashboard subscriptionPlan={subscriptionPlan} />;
}
