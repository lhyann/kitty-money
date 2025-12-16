// src/screens/SettingsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>设置页面</Text>
      <Text style={styles.subText}>导出数据、猫猫换肤都在这里</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, color: COLORS.textMain, fontWeight: 'bold' },
  subText: { marginTop: 10, color: COLORS.textSub }
});