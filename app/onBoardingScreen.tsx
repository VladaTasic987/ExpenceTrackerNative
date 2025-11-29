import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";

export default function OnboardingScreen() {
  const { hasSeenOnboarding, setOnboardingSeen } = useAuth();
  const router = useRouter();

  const handleFinish = async () => {
    await setOnboardingSeen();
    router.replace("/home"); 
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📚 Dobrodošli u BookClub!</Text>
      <Text style={styles.description}>
        Dodajte, pratite i delite svoje knjige. 
        Čitajte, pravite beleške i razgovarajte 
        sa prijateljima u našem chatu.
      </Text>
      <Button mode="contained" onPress={handleFinish} style={styles.button}>
        Započni
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fff",
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  description: { fontSize: 18, marginBottom: 40, textAlign: "center", lineHeight: 26 },
  button: { paddingVertical: 8, paddingHorizontal: 20 },
});
