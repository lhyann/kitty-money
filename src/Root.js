// src/Root.js
import React from 'react';
import { SafeAreaView } from 'react-native';
import HomeScreen from './screens/HomeScreen';

export default function Root() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HomeScreen />
    </SafeAreaView>
  );
}
