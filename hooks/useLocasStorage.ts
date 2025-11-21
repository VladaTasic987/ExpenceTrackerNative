import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import uuid from 'react-native-uuid';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string; // ISO string
}

export const useLocalStorage = () => {
  const [income, setIncome] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Učitaj sve lokalne podatke kad se aplikacija pokrene
  useEffect(() => {
    const loadData = async () => {
      const storedIncome = await AsyncStorage.getItem('income');
      const storedTransactions = await AsyncStorage.getItem('transactions');

      if (storedIncome) setIncome(Number(storedIncome));
      if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    };

    loadData();
  }, []);

  // Dodaj transakciju
  const addTransaction = async (title: string, amount: number) => {
    const newTransaction: Transaction = {
      id: uuid.v4().toString(), // ✅ ovo radi u React Native
      title,
      amount,
      date: new Date().toISOString(),
    };

    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    await AsyncStorage.setItem('transactions', JSON.stringify(updated));
  };

  // Postavi dohodak
  const saveIncome = async (value: number) => {
    setIncome(value);
    await AsyncStorage.setItem('income', value.toString());
  };

  // Očisti sve podatke
  const clearAll = async () => {
    await AsyncStorage.clear();
    setIncome(null);
    setTransactions([]);
  };

  return {
    income,
    transactions,
    addTransaction,
    saveIncome,
    clearAll,
  };
};
