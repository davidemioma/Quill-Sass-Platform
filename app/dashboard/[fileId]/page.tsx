import prismadb from "@/lib/prismadb";
import PdfRenderer from "@/components/PdfRenderer";
import { notFound, redirect } from "next/navigation";
import PdfChatWrapper from "@/components/chat/PdfChatWrapper";
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

  const dbUser = await prismadb.user.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!dbUser) {
    return redirect("/auth-callback?origin=dashboard");
  }

  const file = await prismadb.file.findUnique({
    where: {
      id: fileId,
      userId: dbUser.id,
    },
  });

  if (!file) {
    return notFound();
  }

  return (
    <div className="pt-14">
      <div className="h-[calc(100vh-3.5rem)] flex flex-col flex-1 justify-between">
        <div className="w-full max-w-8xl mx-auto grow lg:flex xl:px-2">
          <div className="flex-1 xl:flex">
            <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
              <PdfRenderer url={file.url} />
            </div>
          </div>

          <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
            <PdfChatWrapper fileId={file.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
