import prismadb from "@/lib/prismadb";
import { PLANS } from "@/config/stripe";
import { pinecone } from "@/lib/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserSubscriptionPlan } from "@/app/actions/getUserSubscriptionPlan";

const f = createUploadthing();

const handleAuth = async () => {
  const { getUser } = getKindeServerSession();

  const user = getUser();

  if (!user || !user.id) throw new Error("Unauthorized");

  const dbUser = await prismadb.user.findUnique({
    where: {
      userId: user.id,
    },
  });

  const subscriptionPlan = await getUserSubscriptionPlan();

  return { subscriptionPlan, userId: dbUser?.id };
};

type OnCompleteProps = {
  metadata: Awaited<ReturnType<typeof handleAuth>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
};

const onUploadComplete = async ({ metadata, file }: OnCompleteProps) => {
  const fileExist = await prismadb.file.findFirst({
    where: {
      key: file.key,
      userId: metadata.userId,
    },
  });

  if (fileExist) return;

  if (!metadata.userId || !metadata.subscriptionPlan) return;

  const createdFile = await prismadb.file.create({
    data: {
      key: file.key,
      name: file.name,
      userId: metadata.userId,
      url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
      uploadStatus: "PROCESSING",
    },
  });

  try {
    //Getting the pdf from uploadthing
    const res = await fetch(
      `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
    );

    const blob = await res.blob();

    const loader = new PDFLoader(blob);

    //Page content
    const pageLevelDocs = await loader.load();

    //Number of pages in your Pdf doc
    const pagesAmt = pageLevelDocs.length;

    const { subscriptionPlan } = metadata;

    const { isSubscribed } = subscriptionPlan;

    const isProExceeded =
      pagesAmt > PLANS.find((plan) => plan.name === "Pro")!.pagesPerPdf;

    const isFreeExceeded =
      pagesAmt > PLANS.find((plan) => plan.name === "Free")!.pagesPerPdf;

    if ((isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)) {
      await prismadb.file.update({
        where: {
          id: createdFile.id,
        },
        data: {
          uploadStatus: "FAILED",
        },
      });
    }

    // vectorize and index entire document
    const pineconeIndex = pinecone.Index("quill");

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
      namespace: createdFile.id, //For upgraded plans only //1536
    });

    await prismadb.file.update({
      where: {
        id: createdFile.id,
      },
      data: {
        uploadStatus: "SUCCESS",
      },
    });
  } catch (err) {
    console.log(err);
    await prismadb.file.update({
      where: {
        id: createdFile.id,
      },
      data: {
        uploadStatus: "FAILED",
      },
    });
  }
};

export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
