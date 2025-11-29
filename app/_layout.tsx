import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthProvider, useAuth } from "@/context/authContext";
import { ChatProvider } from "@/context/chatContext";
import { BooksProvider } from "@/context/booksContext";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider, useTheme } from "@/context/themeContext";

function AppNavigator() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem("hasSeenOnboarding");
      setShowOnboarding(seen !== "true");
    };
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (loading || showOnboarding === null) return;

    if (showOnboarding) {
      router.replace("/onBoardingScreen");
    } else if (session) {
      router.replace("/(tabs)");
    } else {
      router.replace("/home");
    }

    return 
  }, [loading, showOnboarding, session]);

  if (loading || showOnboarding === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="onBoardingScreen" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemeConsumerWrapper />
    </ThemeProvider>
  );
}

function ThemeConsumerWrapper() {
  const { theme } = useTheme();

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <ChatProvider>
          <BooksProvider>
            <AppNavigator />
          </BooksProvider>
        </ChatProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
