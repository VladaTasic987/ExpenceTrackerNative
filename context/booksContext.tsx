import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/scripts/supabaseClient";
import { useAuth } from "@/context/authContext";
import { Alert } from "react-native";
import uuid from "react-native-uuid";

export interface Book {
  id: string;
  user_id?: string;
  title: string;
  author: string;
  genre?: string;
  notes?: string;
  created_at?: string;
}

interface BooksContextType {
  localBooks: Book[];
  addLocalBook: (title: string, author: string, genre?: string, notes?: string) => void;
  deleteLocalBook: (id: string) => void;
  submitBookToSupabase: (book: Book) => Promise<void>;
  books: Book[];
  fetchBooks: () => Promise<void>;
  loading: boolean;
  deleteSupabaseBook: (id: string) => Promise<void>;
}

const BooksContext = createContext<BooksContextType | null>(null);
const LOCAL_STORAGE_KEY = "@local_books";

export const BooksProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useAuth();
  const [localBooks, setLocalBooks] = useState<Book[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadLocalBooks = async () => {
      try {
        const stored = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) setLocalBooks(JSON.parse(stored));
      } catch (e) {
        console.log("Greška pri učitavanju lokalnih knjiga:", e);
      }
    };
    loadLocalBooks();
  }, []);

  useEffect(() => {
    if (!session?.user) return;

    const channel = supabase
      .channel("books-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "books" },
        (payload) => {
          fetchBooks().catch((err) => console.log("Realtime fetch error:", err));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user]);

  const addLocalBook = (title: string, author: string, genre?: string, notes?: string) => {
    const newBook: Book = { id: uuid.v4().toString(), title, author, genre, notes };
    const updated = [newBook, ...localBooks];
    setLocalBooks(updated);
    AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated)).catch(console.log);
  };

  const deleteLocalBook = (id: string) => {
    const updated = localBooks.filter((b) => b.id !== id);
    setLocalBooks(updated);
    AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated)).catch(console.log);
  };

  const submitBookToSupabase = async (book: Book) => {
    if (!session?.user) return;

    const supabaseBook = { ...book, user_id: session.user.id };
    const { error } = await supabase.from("books").insert(supabaseBook);

    if (error) Alert.alert("❌ Greška pri slanju", error.message);
    else {
      Alert.alert("📚", "Knjiga poslata u Supabase!");
      deleteLocalBook(book.id);
      await fetchBooks();
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) Alert.alert("❌ Greška pri učitavanju", error.message);
    else setBooks(data || []);

    setLoading(false);
  };

  const deleteSupabaseBook = async (id: string) => {
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) Alert.alert("❌ Greška pri brisanju", error.message);
    else setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <BooksContext.Provider
      value={{
        localBooks,
        addLocalBook,
        deleteLocalBook,
        submitBookToSupabase,
        books,
        fetchBooks,
        loading,
        deleteSupabaseBook,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => {
  const ctx = useContext(BooksContext);
  if (!ctx) throw new Error("useBooks must be used within BooksProvider");
  return ctx;
};
