import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default function Dashboard() {
  const { getUser } = getKindeServerSession();

  const user = getUser();

  if (!user || !user.id) {
    return redirect("/auth-callback?origin=dashboard");
  }

  return <div>Dashboard</div>;
}
