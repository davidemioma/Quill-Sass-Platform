import { z } from "zod";
import prismadb from "@/lib/prismadb";
import { openai } from "@/lib/openai";
import { pinecone } from "@/lib/pinecone";
import { NextResponse } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(request: Request) {
  try {
    const { getUser } = getKindeServerSession();

    const user = getUser();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const { fileId, message } = z
      .object({
        fileId: z.string(),
        message: z.string(),
      })
      .parse(body);

    const fileExists = await prismadb.file.findUnique({
      where: {
        id: fileId,
        userId: user.id,
      },
    });

    if (!fileExists) {
      return new NextResponse("File not found", {
        status: 404,
      });
    }

    await prismadb.message.create({
      data: {
        text: message,
        userId: user.id,
        fileId,
        isUserMessage: true,
      },
    });

    //Vectorize message
    const pineconeIndex = pinecone.Index("quill");

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: fileExists.id,
    });

    const results = await vectorStore.similaritySearch(message, 4);

    const prevMessages = await prismadb.message.findMany({
      where: {
        fileId,
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 6,
    });

    const formattedMessages = prevMessages.map((msg) => ({
      role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
      content: msg.text,
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
        },
        {
          role: "user",
          content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
          \n----------------\n
  
          PREVIOUS CONVERSATION:
          ${formattedMessages.map((message) => {
            if (message.role === "user") return `User: ${message.content}\n`;

            return `Assistant: ${message.content}\n`;
          })}
  
          \n----------------\n
  
          CONTEXT:
          ${results.map((r) => r.pageContent).join("\n\n")}
  
          USER INPUT: ${message}`,
        },
      ],
    });

    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        await prismadb.message.create({
          data: {
            text: completion,
            isUserMessage: false,
            fileId,
            userId: user.id!,
          },
        });
      },
    });

    return new StreamingTextResponse(stream);
  } catch (err) {
    console.log("SEND_MESSAGE", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
