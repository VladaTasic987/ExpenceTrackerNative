import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import uuid from 'react-native-uuid';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string; 
}

export const useLocalStorage = () => {
  const [income, setIncome] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  
  useEffect(() => {
    const loadData = async () => {
      const storedIncome = await AsyncStorage.getItem('income');
      const storedTransactions = await AsyncStorage.getItem('transactions');

      if (storedIncome) setIncome(Number(storedIncome));
      if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    };

    loadData();
  }, []);

  
  const addTransaction = async (title: string, amount: number) => {
    const newTransaction: Transaction = {
      id: uuid.v4().toString(), 
      title,
      amount,
      date: new Date().toISOString(),
    };

    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    await AsyncStorage.setItem('transactions', JSON.stringify(updated));
  };

  
  const saveIncome = async (value: number) => {
    setIncome(value);
    await AsyncStorage.setItem('income', value.toString());
  };

  
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
