import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/scripts/supabaseClient";

export interface MessageWithUser {
  id: number;
  text: string;
  user_id: string;
  created_at: string;
  first_name: string;
  last_name: string;
}

interface ChatContextType {
  messages: MessageWithUser[];
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
  const [messages, setMessages] = useState<MessageWithUser[]>([]);

  
  const loadMessages = async () => {
    const { data, error } = await supabase
      .from("messages_with_user")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading messages:", error.message);
      return;
    }

    if (data) setMessages(data as MessageWithUser[]);
  };

  const sendMessage = async (text: string, user_id: string) => {
    const tempId = Date.now();
    const newMsg: MessageWithUser = {
      id: tempId,
      text,
      user_id,
      created_at: new Date().toISOString(),
      first_name: "", 
      last_name: "",
    };

    setMessages(prev => [newMsg, ...prev]);

    
    const { data, error } = await supabase
      .from("messages")
      .insert([{ text, user_id }])
      .select("*"); 

    if (error) {
      console.error("Error sending message:", error.message);
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    } else {
      
      await loadMessages();
    }
  };

  const deleteMessage = async (id: number) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) {
      console.error("Error deleting message:", error.message);
    } 
    await loadMessages(); 
  };

  useEffect(() => {
  loadMessages();

  const subscription = supabase
    .channel("public:messages")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      async (payload) => {
        
        const { data, error } = await supabase
          .from("messages_with_user")
          .select("*")
          .eq("id", payload.new.id)
          .single();

        if (error) {
          console.error("Error fetching new message for real-time:", error.message);
          return;
        }

        if (data) {
          const newMessage: MessageWithUser = {
            id: data.id,
            text: data.text,
            user_id: data.user_id,
            created_at: data.created_at,
            first_name: data.first_name,
            last_name: data.last_name,
          };

          setMessages(prev => [newMessage, ...prev]);
        }
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
