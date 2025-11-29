import { useState, useEffect } from "react";
import { supabase } from "@/scripts/supabaseClient";
import { useAuth } from "@/context/authContext";

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export const useUser = () => {
  const { session } = useAuth(); 
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, email, first_name, last_name")
        .eq("id", userId)
        .single();

      if (error) console.error("Error fetching user profile", error);
      if (data) setUserProfile(data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!session?.user) return;

    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", session.user.id);

    if (error) console.error("Error updating profile", error);
    else await fetchUserProfile(session.user.id); 
  };

  useEffect(() => {
    const init = async () => {
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      setLoading(false); 
    };

    init();
  }, [session]);

  

  return { userProfile, loading, updateUserProfile };
};
