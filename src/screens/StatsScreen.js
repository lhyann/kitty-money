// src/screens/StatsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>统计页面 (开发中...)</Text>
      <Text style={styles.subText}>这里将会放那个大饼图</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, color: COLORS.textMain, fontWeight: 'bold' },
  subText: { marginTop: 10, color: COLORS.textSub }
});