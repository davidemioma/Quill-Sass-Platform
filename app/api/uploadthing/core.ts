import prismadb from "@/lib/prismadb";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const f = createUploadthing();

const middleware = async () => {
  const { getUser } = getKindeServerSession();

  const user = getUser();

  if (!user || !user.id) throw new Error("Unauthorized");

  const dbUser = await prismadb.user.findUnique({
    where: {
      userId: user.id,
    },
  });

  return { userId: dbUser?.id };
};

type OnCompleteProps = {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
};

const onUploadComplete = async ({ metadata, file }: OnCompleteProps) => {
  try {
    const fileExist = await prismadb.file.findFirst({
      where: {
        key: file.key,
        userId: metadata.userId,
      },
    });

    if (fileExist) return;

    if (!metadata.userId) return;

    await prismadb.file.create({
      data: {
        key: file.key,
        name: file.name,
        userId: metadata.userId,
        url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
        uploadStatus: "PROCESSING",
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
