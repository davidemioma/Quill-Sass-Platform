"use client";

import React from "react";
import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface Props {
  isDisabled?: boolean;
}

const ChatInput = ({ isDisabled }: Props) => {
  return (
    <div className="w-full p-4 mx-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
      <div className="flex items-center gap-3">
        <Textarea
          className="resize-none py-3 pr-12 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
          rows={1}
          maxRows={4}
          autoFocus
          placeholder="Enter your question..."
        />

        <Button
          className=""
          aria-label="send message"
          onClick={() => {}}
          disabled={isDisabled}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
