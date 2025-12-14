// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { Categories, Transactions } from '../db';

export default function HomeScreen() {
  const db = useSQLiteContext();
  const [cats, setCats] = useState([]);
  const [txs, setTxs] = useState([]);

  async function refresh() {
    const [c, t] = await Promise.all([
      Categories.listCategories(db),
      Transactions.listTransactions(db, { limit: 50 }),
    ]);
    setCats(c);
    setTxs(t);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function addSampleCategory() {
    await Categories.createCategory(db, {
      name: `饮料${cats.length + 1}`,
      icon: '🥤',
      color: '#7FB3D5',
    });
    await refresh();
  }

  async function addSampleTransaction() {
    const firstCat = cats[0]?.id ?? null;
    await Transactions.createTransaction(db, {
      amount: 1990, // 19.90 -> 1990 分
      type: 'expense',
      categoryId: firstCat,
      note: '冰美式',
      merchant: '星巴克',
      paymentMethod: 'debit',
    });
    await refresh();
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Kitty Money DB Test</Text>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable onPress={addSampleCategory} style={{ padding: 12, backgroundColor: '#eee', borderRadius: 10 }}>
          <Text>+ Category</Text>
        </Pressable>
        <Pressable onPress={addSampleTransaction} style={{ padding: 12, backgroundColor: '#eee', borderRadius: 10 }}>
          <Text>+ Transaction</Text>
        </Pressable>
        <Pressable onPress={refresh} style={{ padding: 12, backgroundColor: '#eee', borderRadius: 10 }}>
          <Text>Refresh</Text>
        </Pressable>
      </View>

      <Text style={{ marginTop: 10, fontWeight: '600' }}>Categories ({cats.length})</Text>
      {cats.map((c) => (
        <Text key={c.id}>#{c.id} {c.icon ?? ''} {c.name}</Text>
      ))}

      <Text style={{ marginTop: 10, fontWeight: '600' }}>Transactions ({txs.length})</Text>
      {txs.map((t) => (
        <Text key={t.id}>
          #{t.id} [{t.type}] {t.amount}分 — {t.category_name ?? '未分类'} — {t.merchant ?? ''} {t.note ?? ''}
        </Text>
      ))}
    </ScrollView>
  );
}
