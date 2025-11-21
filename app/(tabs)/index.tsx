import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { useTransactions } from "@/context/transactionContext";
import { useTable } from "@/hooks/useTable";

export default function HomeScreen() {
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"prihod" | "rashod" | null>(null);

  const { connected, error } = useTable();

  useEffect(() => {
    const handleNet = (state: NetInfoState) =>
      Alert.alert(state.isConnected ? "📶 Ima interneta!" : "❌ Nema interneta!");
    NetInfo.fetch().then(handleNet);
    const unsub = NetInfo.addEventListener(handleNet);
    return () => unsub();
  }, []);

  const handleAdd = async () => {
    if (!name || !amount || !type) {
      Alert.alert("⚠️", "Popuni sva polja!");
      return;
    }

    const value = type === "rashod" ? -Math.abs(+amount) : Math.abs(+amount);
    await addTransaction(name, value, type);
    setName("");
    setAmount("");
    setType(null);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={s.row}>
      <View>
        <Text>{item.name}</Text>
        <Text>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <View style={s.row}>
        <Text style={{ color: item.amount >= 0 ? "green" : "red" }}>
          {item.amount >= 0 ? "+" : ""}
          {item.amount} RSD
        </Text>
        <TouchableOpacity onPress={() => deleteTransaction(item.id)}>
          <Text>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={s.container}>
      <Text style={s.header}>🏠 Početna</Text>

      <TextInput
        placeholder="Naziv transakcije"
        style={s.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Iznos"
        style={s.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <View style={s.row}>
        <TouchableOpacity
          onPress={() => setType("prihod")}
          style={[
            s.btn,
            { backgroundColor: type === "prihod" ? "#007bff" : "#ccc" },
          ]}
        >
          <Text style={{ color: "#fff" }}>prihod</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setType("rashod")}
          style={[
            s.btn,
            { backgroundColor: type === "rashod" ? "#007bff" : "#ccc" },
          ]}
        >
          <Text style={{ color: "#fff" }}>rashod</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={s.add} onPress={handleAdd}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Dodaj</Text>
      </TouchableOpacity>

      <Text style={s.sub}>Poslednje 3 transakcije</Text>
      <FlatList
        data={transactions.slice(0, 3)}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={s.empty}>Nema unetih transakcija.</Text>}
      />

      <View style={{ padding: 20 }}>
        <Text>
          {connected === null
            ? "Proveravam konekciju..."
            : connected
            ? "✅ Povezan sa Supabase tabelom!"
            : "❌ Nema konekcije ili greška!"}
        </Text>
        {error && <Text style={{ color: "red" }}>{error}</Text>}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", marginTop: 40 },
  header: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  sub: { fontSize: 18, marginVertical: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  add: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  empty: { textAlign: "center", color: "#999", marginTop: 10 },
});