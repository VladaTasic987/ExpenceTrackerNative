import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View, Text } from "react-native";

import { AuthProvider, useAuth } from "@/context/authContext";
import { ChatProvider } from "@/context/chatContext";
import { BooksProvider } from "@/context/booksContext";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider, useTheme } from "@/context/themeContext";

function AppNavigator() {
  const { session, loading, hasSeenOnboarding } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || hasSeenOnboarding === null) return;

    if (!session && hasSeenOnboarding === false) {
      
      router.replace("/onBoardingScreen");
    } else if (!session) {
      
      router.replace("/home");
    } else {
      
      router.replace("/(tabs)");
    }
  }, [loading, session, hasSeenOnboarding]);

  if (loading || hasSeenOnboarding === null) {
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
