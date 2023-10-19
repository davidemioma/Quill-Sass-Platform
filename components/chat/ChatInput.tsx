"use client";

import React, { useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useChatContext } from "@/context/ChatProvider";

interface Props {
  isDisabled?: boolean;
}

const ChatInput = ({ isDisabled }: Props) => {
  const chatContext = useChatContext();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="w-full p-4 mx-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
      <div className="flex items-center gap-3">
        <Textarea
          className="resize-none py-3 pr-12 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
          rows={1}
          maxRows={4}
          ref={textareaRef}
          autoFocus
          value={chatContext?.message}
          placeholder="Enter your question..."
          onChange={chatContext?.handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();

              chatContext?.sendMessage();

              textareaRef.current?.focus();
            }
          }}
        />

        <Button
          className=""
          aria-label="send message"
          onClick={() => {
            chatContext?.sendMessage();

            textareaRef.current?.focus();
          }}
          disabled={isDisabled || chatContext?.isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
