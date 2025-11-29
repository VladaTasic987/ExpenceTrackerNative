import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/themeContext';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 40,
        paddingBottom: 0,
        backgroundColor: theme.colors.background,
      }}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onBackground + '99',
          tabBarStyle: {
            height: 30 + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 5,
            paddingTop: 2,
            backgroundColor: theme.colors.background,
            borderTopWidth: 0.5,
            borderTopColor: theme.colors.onBackground + '33',
          },
          tabBarLabelStyle: { fontSize: 11 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="BookListScreen"
          options={{
            title: 'BookList',
            tabBarIcon: ({ color, size }) => <Ionicons name="book" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="ChatScreen"
          options={{
            title: 'Chat',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-ellipses-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="MyAccount"
          options={{
            title: 'My Account',
            tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" color={color} size={size} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
