import { useEffect, useState } from "react";
import { supabase } from "@/scripts/supabaseClient";
import { useAuth } from "@/context/authContext";

export const useTable = () => {

  const { session } = useAuth();
  const [connected, setConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const checkConnection = async () => {
      if (!session?.user) {
        setConnected(false)
        return;
      }
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", session.user.id)
        .limit(1);

    if (error) {
      setError(error.message)
      setConnected(false)
    } else {
      setConnected(true)
    }

    checkConnection();
    
    }     
  }, [session])

  return { connected, error }

}