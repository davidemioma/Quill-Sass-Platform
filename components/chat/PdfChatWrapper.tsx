"use client";

import React from "react";
import Link from "next/link";
import Messages from "./Messages";
import ChatInput from "./ChatInput";
import { trpc } from "@/lib/_trpcClient";
import { buttonVariants } from "../ui/button";
import { ChatProvider } from "@/context/ChatProvider";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";

interface Props {
  fileId: string;
}

const PdfChatWrapper = ({ fileId }: Props) => {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    {
      fileId,
    },
    {
      refetchInterval: (data) =>
        data?.status === "SUCCESS" || data?.status === "FAILED" ? false : 500,
    }
  );

  if (isLoading)
    return (
      <div className="relative min-h-full bg-zinc-50 flex flex-col justify-between gap-2 divide-y divide-zinc-200">
        <div className="flex-1 flex flex-col justify-center items-center mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />

            <h3 className="text-xl font-semibold">Loading...</h3>

            <p className="text-sm text-zinc-500">
              We&apos;re preparing your PDF.
            </p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );

  if (data?.status === "PROCESSING") {
    return (
      <div className="relative min-h-full bg-zinc-50 flex flex-col justify-between gap-2 divide-y divide-zinc-200">
        <div className="flex-1 flex flex-col justify-center items-center mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />

            <h3 className="text-xl font-semibold">Processing PDF...</h3>

            <p className="text-sm text-zinc-500">This won&apos;t take long.</p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );
  }

  if (data?.status === "FAILED") {
    return (
      <div className="relative min-h-full bg-zinc-50 flex flex-col justify-between gap-2 divide-y divide-zinc-200">
        <div className="flex-1 flex flex-col justify-center items-center mb-28">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-red-500" />

            <h3 className="text-xl font-semibold">Too many pages in PDF</h3>

            <p className="text-sm text-zinc-500">
              Your <span className="font-medium">Pro</span> plan supports up to
              5 pages per PDF.
            </p>

            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "secondary",
                className: "mt-4",
              })}
            >
              <ChevronLeft className="h-3 w-3 mr-1.5" />
              Back
            </Link>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );
  }

  return (
    <ChatProvider fileId={fileId}>
      <div className="relative bg-zinc-50 min-h-full flex flex-col justify-between gap-2 divide-y divide-zinc-200">
        <div className="flex-1 flex flex-col justify-between mb-28">
          <Messages fileId={fileId} />
        </div>

        <ChatInput />
      </div>
    </ChatProvider>
  );
};

export default PdfChatWrapper;
