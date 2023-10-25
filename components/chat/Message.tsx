import React, { forwardRef } from "react";
import { Icons } from "../Icon";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { ExtendedMessage } from "@/types/message";

interface Props {
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
}

const Message = forwardRef<HTMLDivElement, Props>(
  ({ message, isNextMessageSamePerson }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-end", {
          "justify-end": message.isUserMessage,
        })}
      >
        <div
          className={cn(
            "relative h-6 w-6 aspect-square flex items-center justify-center",
            message.isUserMessage
              ? "order-2 bg-blue-600 rounded-sm"
              : "order-1 bg-zinc-800 rounded-sm",
            isNextMessageSamePerson && "invisible"
          )}
        >
          {message.isUserMessage ? (
            <Icons.user className="fill-zinc-200 text-zinc-200 h-3/4 w-3/4" />
          ) : (
            <Icons.logo className="fill-zinc-300 h-3/4 w-3/4" />
          )}
        </div>

        <div
          className={cn(
            "max-w-md flex flex-col space-y-2 text-base mx-2",
            message.isUserMessage ? "order-2 items-end" : "order-1 items-start"
          )}
        >
          <div
            className={cn("px-4 py-2 rounded-lg inline-block", {
              "bg-blue-600 text-white": message.isUserMessage,
              "bg-gray-200 text-gray-900": !message.isUserMessage,
              "rounded-br-none":
                !isNextMessageSamePerson && message.isUserMessage,
              "rounded-bl-none":
                !isNextMessageSamePerson && !message.isUserMessage,
            })}
          >
            {typeof message.text === "string" ? (
              <ReactMarkdown
                className={cn("prose", message.isUserMessage && "text-zinc-50")}
              >
                {message.text}
              </ReactMarkdown>
            ) : (
              message.text
            )}

            {message.id !== "loading-message" && (
              <div
                className={cn(
                  "text-xs select-none mt-2 w-full text-right",
                  message.isUserMessage ? "text-blue-300" : "text-zinc-500"
                )}
              >
                {format(new Date(message.createdAt), "HH:mm")}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Message.displayName = "Message";

export default Message;
