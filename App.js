// App.js
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';
import { migrateDbIfNeeded } from './src/db/migrate';
import Root from './src/Root';

export default function App() {
  return (
    <SQLiteProvider databaseName="kitty-money.db" onInit={migrateDbIfNeeded}>
      <Root />
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
