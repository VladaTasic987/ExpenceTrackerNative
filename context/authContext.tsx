import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/scripts/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "hasSeenOnboarding";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasSeenOnboarding: boolean | null;
  setOnboardingSeen: () => Promise<void>;
  resetOnboardingState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboardingState] = useState<boolean | null>(null);

  // inicijalizacija session-a i onboarding stanja
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      const seen = await AsyncStorage.getItem(ONBOARDING_KEY);
      setHasSeenOnboardingState(seen === "true");

      setLoading(false);
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const setOnboardingSeen = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    setHasSeenOnboardingState(true);
  };

  const resetOnboardingState = async () => {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
    setHasSeenOnboardingState(false); 
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (!data.user) throw new Error("User not created");

      await supabase.from("users").insert([{ id: data.user.id, email, first_name: firstName, last_name: lastName }]);
      setSession(data.session ?? null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.session) throw new Error("Login failed");

      setSession(data.session);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        signUp,
        signIn,
        signOut,
        hasSeenOnboarding,
        setOnboardingSeen,
        resetOnboardingState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
