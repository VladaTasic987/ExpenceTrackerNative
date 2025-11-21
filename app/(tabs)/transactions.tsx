// screens/TransactionsScreen.tsx
import React, { use, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useTransactions } from "@/context/transactionContext";

export default function TransactionsScreen() {
  
  const { transactions, deleteTransaction } = useTransactions();
  const [ totalIncome, setTotalIncome ] = useState<number>(0);
  const [ totalExpenses, setTotalExpences ] = useState<number>(0);

  // Preračunavanje ukupnog prihoda i troškova kad se transactions promeni

  useEffect(() => {

    const income = transactions.reduce((sum, t) => sum + (t.amount > 0 ? t.amount : 0), 0);
    const expenses = transactions.reduce((sum, t) => sum + (t.amount < 0 ? -t.amount : 0), 0);
    setTotalIncome(income);
    setTotalExpences(expenses);

  }, [transactions]);

  const remainingMoney = totalIncome - totalExpenses;

  const renderTransaction = ({ item }: any) => (

    <View style={styles.transactionItem}>

      <View>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionDate}>{new Date(item.date).toLocaleString()}</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>

        <Text style={[styles.transactionAmount, { color: item.amount > 0 ? "green" : "red" }]}>
          {item.amount > 0 ? `+${item.amount}` : item.amount} RSD
        </Text>

        <TouchableOpacity onPress={() => deleteTransaction(item.id)}>
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>

      </View>

    </View>

  )

  return (
    <View style={styles.container}>
      <Text style={styles.header}>💰 Sve transakcije</Text>
      <Text style={styles.subHeader}>Ukupan prihod: {totalIncome} RSD</Text>
      <Text style={styles.subHeader}>Ukupno troškova: {totalExpenses} RSD</Text>
      <Text style={styles.subHeader}>Ostalo od dohotka: {remainingMoney} RSD</Text>

      {transactions.length === 0 ? (
        <Text style={styles.empty}>Nema unetih transakcija.</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", marginTop: 40 },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  subHeader: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  transactionItem: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#ddd", alignItems: "center" },
  transactionTitle: { fontSize: 16, fontWeight: "500" },
  transactionDate: { fontSize: 12, color: "#666" },
  transactionAmount: { fontSize: 16, fontWeight: "bold", marginRight: 10 },
  deleteText: { fontSize: 18 },
  empty: { textAlign: "center", color: "#999", marginTop: 20, fontSize: 16 },
});
