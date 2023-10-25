import axios from "axios";
import { trpc } from "@/lib/_trpcClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { createContext, useContext, useState, useRef } from "react";

interface ChatProps {
  message: string;
  isLoading: boolean;
  sendMessage: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

interface ChildrenProps {
  fileId: string;
  children: React.ReactNode;
}

export const ChatContext = createContext<ChatProps | null>(null);

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ fileId, children }: ChildrenProps) => {
  const { toast } = useToast();

  const utils = trpc.useContext();

  const backupMessage = useRef("");

  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const { mutate: addMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const res = await axios.post("/api/messages", {
        fileId,
        message,
      });

      return res.data;
    },
    onMutate: async ({ message }) => {
      backupMessage.current = message;

      setMessage("");

      //step 1
      await utils.getFileMessages.cancel();

      //step 2
      const prevMessages = utils.getFileMessages.getInfiniteData();

      //step 3
      utils.getFileMessages.setInfiniteData(
        {
          fileId,
          limit: INFINITE_QUERY_LIMIT,
        },
        (oldData) => {
          if (!oldData) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          let newPages = [...oldData.pages];

          let latestPage = newPages[0]!;

          latestPage.messages = [
            {
              createdAt: new Date().toISOString(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
            },
            ...latestPage.messages,
          ];

          newPages[0] = latestPage;

          return {
            ...oldData,
            pages: newPages,
          };
        }
      );

      setIsLoading(true);

      return {
        previousMessages:
          prevMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },
    onSuccess: async (stream) => {
      setIsLoading(false);

      if (!stream) {
        return toast({
          title: "There was a problem sending this message",
          description: "Please refresh this page and try again",
          variant: "destructive",
        });
      }

      const reader = stream.getReader();

      const decoder = new TextDecoder();

      let done = false;

      // accumulated response
      let accResponse = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();

        done = doneReading;

        const chunkValue = decoder.decode(value);

        accResponse += chunkValue;

        // append chunk to the actual message
        utils.getFileMessages.setInfiniteData(
          {
            fileId,
            limit: INFINITE_QUERY_LIMIT,
          },
          (oldData) => {
            if (!oldData) {
              return {
                pages: [],
                pageParams: [],
              };
            }

            let isAiResponseCreated = oldData.pages.some((page) =>
              page.messages.some((message) => message.id === "ai-response")
            );

            let updatedPages = oldData.pages.map((page) => {
              if (page === oldData.pages[0]) {
                let updatedMessages;

                if (!isAiResponseCreated) {
                  updatedMessages = [
                    {
                      createdAt: new Date().toISOString(),
                      id: "ai-response",
                      text: accResponse,
                      isUserMessage: false,
                    },
                    ...page.messages,
                  ];
                } else {
                  updatedMessages = page.messages.map((message) => {
                    if (message.id === "ai-response") {
                      return {
                        ...message,
                        text: accResponse,
                      };
                    }

                    return message;
                  });
                }

                return {
                  ...page,
                  messages: updatedMessages,
                };
              }

              return page;
            });

            return { ...oldData, pages: updatedPages };
          }
        );
      }
    },
    onError: (_, __, context) => {
      setMessage(backupMessage?.current);

      utils.getFileMessages.setData(
        {
          fileId,
        },
        {
          messages: context?.previousMessages ?? [],
        }
      );
    },
    onSettled: async () => {
      setIsLoading(false);

      await utils.getFileMessages.invalidate({ fileId });
    },
  });

  const sendMessage = () => {
    addMessage({ message });
  };

  return (
    <ChatContext.Provider
      value={{
        message,
        isLoading,
        sendMessage,
        handleInputChange,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
