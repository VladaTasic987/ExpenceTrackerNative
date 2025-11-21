import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/scripts/supabaseClient";
import { useAuth } from "@/context/authContext";
import { Alert } from "react-native";
import uuid from "react-native-uuid"; // 🟢 Dodato

export interface Transaction {
  id: string;
  user_id: string;
  name: string;
  type: string;
  amount: number;
  date: string;
  created_at?: string;
}

interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (name: string, amount: number, type: string) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  fetchTransactions: () => Promise<void>;
  loading: boolean;
}

const TransactionsContext = createContext<TransactionsContextType | null>(null);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    if (!session?.user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", session.user.id)
      .order("date", { ascending: false });

    if (error) {
      Alert.alert("❌ Greška pri učitavanju", error.message);
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  };

  const addTransaction = async (name: string, amount: number, type: string) => {
    if (!session?.user) return;

    const newTransaction = {
      id: uuid.v4().toString(), // 🟢 Zamenjeno
      user_id: session.user.id,
      name,
      amount,
      type,
      date: new Date().toISOString(),
    };

    const { error } = await supabase.from("transactions").insert(newTransaction);

    if (error) {
      Alert.alert("❌ Greška pri dodavanju", error.message);
    } else {
      Alert.alert("✅", "Transakcija dodata!");
      await fetchTransactions();
    }
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) {
      Alert.alert("❌ Greška pri brisanju", error.message);
    } else {
      Alert.alert("🗑️", "Transakcija obrisana!");
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  useEffect(() => {
    if (session?.user) fetchTransactions();
  }, [session]);

  return (
    <TransactionsContext.Provider
      value={{ transactions, addTransaction, deleteTransaction, fetchTransactions, loading }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error("useTransactions must be used within TransactionsProvider");
  return ctx;
};
