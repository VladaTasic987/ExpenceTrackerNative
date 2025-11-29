import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/scripts/supabaseClient";

export interface Message {
  id: number;
  text: string;
  user_id: string;
  created_at: string;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (text: string, user_id: string) => Promise<void>;
  deleteMessage: (id: number) => void;
  loadMessages: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  
  const loadMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading messages:", error.message);
      return;
    }

    if (data) setMessages(data as Message[]);
  };

  const sendMessage = async (text: string, user_id: string) => {
    const tempId = Date.now();
    const newMsg: Message = {
      id: tempId,
      text,
      user_id,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [newMsg, ...prev]);

    const { data, error } = await supabase
      .from("messages")
      .insert([{ text, user_id }])
      .select();

    if (error) {
      console.error("Error sending message:", error.message);
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    } else if (data && data.length > 0) {
      setMessages(prev =>
        prev.map(msg => (msg.id === tempId ? data[0] : msg))
      );
    }
  };

  
  const deleteMessage = async (id: number) => {
    
    setMessages(prev => prev.filter(msg => msg.id !== id));

    
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting message:", error.message);
      await loadMessages();
    }
  };

  
  useEffect(() => {
    loadMessages();

    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [newMessage, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [messages]);

  return (
    <ChatContext.Provider value={{ messages, sendMessage, deleteMessage, loadMessages }}>
      {children}
    </ChatContext.Provider>
  );
};
