import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button, Surface, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/context/themeContext";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { themeName, theme, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.themeButtonContainer}>
        <IconButton
          icon={themeName === "light" ? "weather-night" : "white-balance-sunny"}
          size={28}
          onPress={toggleTheme}
          iconColor={theme.colors.primary}
        />
      </View>

      <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          Dobrodošli
        </Text>

        <Button
          mode="contained"
          onPress={() => navigation.navigate("login")}
          style={styles.button}
          buttonColor={theme.colors.primary}
          contentStyle={{ paddingVertical: 12 }}
        >
          Login
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate("register")}
          style={styles.button}
          buttonColor={theme.colors.secondary || theme.colors.primary}
          contentStyle={{ paddingVertical: 12 }}
        >
          Register
        </Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  themeButtonContainer: { position: "absolute", top: 40, right: 10, zIndex: 10 },
  card: { width: "100%", padding: 30, borderRadius: 16, elevation: 4, alignItems: "center" },
  title: { marginBottom: 40, textAlign: "center" },
  button: { width: "80%", marginVertical: 10 },
});
