import { useState, useEffect } from "react";
import { supabase } from "@/scripts/supabaseClient";
import { useAuth } from "@/context/authContext";

interface UserProfile {
  email: string;
  first_name: string;
  last_name: string;
}

export const useUser = () => {

const { session, setSession } = useAuth();
const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
const [loading, setLoading] = useState(true);



// Dohvatanja profila korisnika

const fetchUserProfile = async (userId: string) => {

  const { data, error } = await supabase
    .from("users")
    .select("email, first_name, last_name")
    .eq("id", userId)
    .single();

  if (error) console.error("Error fetching user profile", error);
  if (data) setUserProfile(data);  

};

// Azuriranje profila korisnika

const updateUserProfile = async (updates: Partial<UserProfile>) => {

  if (!session?.user) return

  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", session.user.id)

  if (error) {
    console.error("Error updating profile", error);
  } else {
    await fetchUserProfile(session.user.id) // osvezi prikaz nakon izmene
  }
}

// useEffect koji se brine o sessiji i profilu

useEffect(() => {

  const init = async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);

    if (data.session?.user) await fetchUserProfile(data.session.user.id)
    setLoading(false);
  };

  init();

  const { data: listener } = supabase.auth.onAuthStateChange(

    async (_event, newSession) => {

      setSession(newSession);
      if (newSession?.user) await fetchUserProfile(newSession.user.id);
      else setUserProfile(null)
      setLoading(false);
    }
  );

  return () => listener.subscription.unsubscribe();

}, [setSession])

  return { userProfile, loading, updateUserProfile };
}
