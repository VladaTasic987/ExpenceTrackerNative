import { StyleSheet, View, Text, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { useUser } from "@/hooks/useUser";

export default function HomeScreen() {
  const { signOut } = useAuth();
  const { userProfile, updateUserProfile } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(userProfile?.first_name || "");
  const [lastName, setLastName] = useState(userProfile?.last_name || "");

  const handleSave = async () => {
    await updateUserProfile({
      first_name: firstName,
      last_name: lastName,
    });
    setIsEditing(false);
  };

  // Ako se učitava profil
  if (!userProfile) {
    return (
      <View style={styles.container}>
        <Text>Loading user info...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
          />
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.nameText}>
            Welcome, {userProfile.first_name} {userProfile.last_name}!
          </Text>

          <TouchableOpacity style={styles.editButton} onPress={() => {
            setFirstName(userProfile.first_name);
            setLastName(userProfile.last_name);
            setIsEditing(true);
          }}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  nameText: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "80%",
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "gray",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
