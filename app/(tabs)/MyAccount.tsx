import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { Avatar, Text, TextInput, Button, Divider, IconButton } from "react-native-paper";
import { useAuth } from "@/context/authContext";
import { useUser } from "@/hooks/useUser";
import { useTheme } from "@/context/themeContext";

export default function MyAccountScreen() {
  const { signOut, resetOnboardingState } = useAuth();
  const { userProfile, updateUserProfile } = useUser();
  const { theme, toggleTheme, themeName } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.first_name);
      setLastName(userProfile.last_name);
      setEmail(userProfile.email);
    }
  }, [userProfile]);

  const handleSave = async () => {
    await updateUserProfile({ first_name: firstName, last_name: lastName });
    setIsEditing(false);
  };

  const handleResetOnboarding = async () => {
    await resetOnboardingState();
    Alert.alert(
      "Onboarding resetovan!",
      "Sledeći put će se prikazati onboarding ekran."
    );
  };

  if (!userProfile) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onBackground }}>Loading user info...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.themeButtonContainer}>
        <IconButton
          icon={themeName === "light" ? "weather-night" : "white-balance-sunny"}
          size={28}
          onPress={toggleTheme}
          iconColor={theme.colors.primary}
        />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Avatar.Image
          size={100}
          source={{ uri: "https://i.pravatar.cc/300?u=anime" }}
          style={{ marginBottom: 15 }}
        />

        <Text style={[styles.title, { color: theme.colors.onBackground }]}>
          Dobrodošli, {userProfile.first_name} {userProfile.last_name}!
        </Text>

        <Divider style={{ marginVertical: 10, backgroundColor: theme.colors.outline }} />

        {isEditing ? (
          <>
            <TextInput
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              mode="outlined"
              style={styles.input}
              theme={{
                colors: { text: theme.colors.onBackground, primary: theme.colors.primary, background: theme.colors.surface }
              }}
            />
            <TextInput
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              mode="outlined"
              style={styles.input}
              theme={{
                colors: { text: theme.colors.onBackground, primary: theme.colors.primary, background: theme.colors.surface }
              }}
            />

            <Button mode="contained" onPress={handleSave} style={styles.button}>
              Save
            </Button>
            <Button mode="outlined" onPress={() => setIsEditing(false)} style={styles.button}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Text style={[styles.label, { color: theme.colors.onBackground }]}>Email:</Text>
            <Text style={[styles.info, { color: theme.colors.onBackground }]}>{email}</Text>
            <Text style={[styles.label, { color: theme.colors.onBackground }]}>First Name:</Text>
            <Text style={[styles.info, { color: theme.colors.onBackground }]}>{firstName}</Text>
            <Text style={[styles.label, { color: theme.colors.onBackground }]}>Last Name:</Text>
            <Text style={[styles.info, { color: theme.colors.onBackground }]}>{lastName}</Text>

            <Button mode="contained" onPress={() => setIsEditing(true)} style={styles.button}>
              Edit Profile
            </Button>

            <Button mode="contained" onPress={signOut} style={[styles.button, { backgroundColor: "#FF4C4C" }]}>
              Logout
            </Button>

            <Button mode="contained" onPress={handleResetOnboarding} style={[styles.button, { backgroundColor: "#FFA500" }]}>
              Reset Onboarding
            </Button>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  themeButtonContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  info: {
    fontSize: 16,
    fontWeight: "500",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    marginBottom: 12,
  },
  button: {
    width: "100%",
    marginVertical: 5,
    paddingVertical: 5,
  },
});
