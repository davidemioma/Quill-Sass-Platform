import prismadb from "@/lib/prismadb";
import { notFound, redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function FilePage({
  params,
}: {
  params: { fileId: string };
}) {
  const { fileId } = params;

  const { getUser } = getKindeServerSession();

  const user = getUser();

  if (!user || !user.id) {
    return redirect("/auth-callback?origin=dashboard");
  }

  const file = await prismadb.file.findUnique({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!file) {
    return notFound();
  }

  return <div>File Page {fileId}</div>;
}
