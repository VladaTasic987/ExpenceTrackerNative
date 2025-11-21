import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { useAuth } from '@/context/authContext';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await signIn(email, password);
    if (error) Alert.alert('Greška pri logovanju', error.message);
    else Alert.alert('✅ Uspešno logovanje');
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity 
      onPress={()=> router.back()
      }
      style={styles.backButton}
      >
        <Text style={styles.backButtonText}> ⬅️ Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Prijava</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Lozinka"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Uloguj se</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.link}>Nemaš nalog? Registruj se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 10 },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  link: { marginTop: 15, color: '#007AFF', textAlign: 'center' },
    backButton: {
    position: "absolute", 
    top: 52, 
    left: 23, 
  },
  backButtonText: {
    fontSize: 17,
    fontWeight: 600,
    color: "#195161c8",
  }
});