import { Stack, useRouter } from 'expo-router';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/authContext';
import { ActivityIndicator, View } from 'react-native';
import { useUser } from '@/hooks/useUser';

function AppNavigator() {
  const {loading} = useUser();
  const {session} = useAuth();

  const router = useRouter();

  // 🔹 Reaguj kada se session promeni (login/logout)
  useEffect(() => {
    if (loading) return;

    if (session) {
      // ako je korisnik ulogovan, pređi na (tabs)
      router.replace('/(tabs)');
    } else {
      // ako nije, idi na login ekran
      router.replace('/home');
    }
  }, [session, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Expo Router i dalje zahteva Stack — ali će router.replace() menjati ekrane
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="home" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}