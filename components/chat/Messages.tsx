import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { trpc } from "@/lib/_trpcClient";
import Skeleton from "react-loading-skeleton";
import { useIntersection } from "@mantine/hooks";
import { Loader2, MessageSquare } from "lucide-react";
import { useChatContext } from "@/context/ChatProvider";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";

interface Props {
  fileId: string;
}

const Messages = ({ fileId }: Props) => {
  const chatContext = useChatContext();

  const { data, isLoading, fetchNextPage } =
    trpc.getFileMessages.useInfiniteQuery(
      {
        fileId,
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        keepPreviousData: true,
      }
    );

  const messages = data?.pages.flatMap((page) => page.messages);

  const loadingMessage = {
    id: "loading-message",
    text: (
      <span className="h-full flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
    isUserMessage: false,
    createdAt: new Date().toISOString(),
  };

  const combinedMessages = [
    ...(chatContext?.isLoading ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  const lastMessageRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  return (
    <div className="max-h-[calc(100vh-3.5rem-7rem)] flex flex-1 flex-col-reverse gap-4 p-3 border-zinc-200 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      {combinedMessages && combinedMessages.length > 0 ? (
        <>
          {combinedMessages.map((message, i) => {
            const isNextMessageSamePerson =
              combinedMessages[i - 1]?.isUserMessage ===
              combinedMessages[i]?.isUserMessage;

            if (i === combinedMessages.length - 1) {
              return (
                <Message
                  key={message.id}
                  ref={ref}
                  message={message}
                  isNextMessageSamePerson={isNextMessageSamePerson}
                />
              );
            } else {
              return (
                <Message
                  key={message.id}
                  message={message}
                  isNextMessageSamePerson={isNextMessageSamePerson}
                />
              );
            }
          })}
        </>
      ) : isLoading ? (
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-16" />

          <Skeleton className="h-16" />

          <Skeleton className="h-16" />

          <Skeleton className="h-16" />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <MessageSquare className="h-8 w-8 text-blue-500" />

          <h3 className="text-xl font-semibold">You&apos;re all set!</h3>

          <p className="text-sm text-zinc-500">
            Ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
