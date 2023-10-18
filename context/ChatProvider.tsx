import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

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
