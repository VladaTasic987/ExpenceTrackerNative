import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text, Surface } from "react-native-paper";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/themeContext";

export default function RegisterScreen() {
  const { signUp, setOnboardingSeen } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName) {
      return Alert.alert("Popunite sve podatke");
    }

    setLoading(true);
    try {
      await signUp(email, password, firstName, lastName);
      await setOnboardingSeen(); // setuje onboarding odmah nakon registracije
      router.replace("/(tabs)");  // ide direktno u aplikaciju
    } catch (err: any) {
      Alert.alert("Greška pri registraciji", err.message || "Došlo je do greške");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          Kreiraj nalog
        </Text>

        <TextInput
          label="Ime"
          value={firstName}
          onChangeText={setFirstName}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: { text: theme.colors.onBackground, primary: theme.colors.primary, background: theme.colors.surface },
          }}
        />

        <TextInput
          label="Prezime"
          value={lastName}
          onChangeText={setLastName}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: { text: theme.colors.onBackground, primary: theme.colors.primary, background: theme.colors.surface },
          }}
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          mode="outlined"
          style={styles.input}
          theme={{
            colors: { text: theme.colors.onBackground, primary: theme.colors.primary, background: theme.colors.surface },
          }}
        />

        <TextInput
          label="Lozinka"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
          theme={{
            colors: { text: theme.colors.onBackground, primary: theme.colors.primary, background: theme.colors.surface },
          }}
        />

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={{ paddingVertical: 12 }}
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
        >
          Registruj se
        </Button>

        <Button
          mode="text"
          onPress={() => router.push("/login")}
          style={styles.link}
          textColor={theme.colors.primary}
        >
          Već imate nalog? Prijavite se
        </Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  card: { padding: 30, borderRadius: 16, elevation: 4 },
  title: { textAlign: "center", marginBottom: 30 },
  input: { marginBottom: 15 },
  button: { marginTop: 10 },
  link: { marginTop: 10, alignSelf: "center" },
});
