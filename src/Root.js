// App.js
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSQLiteContext, SQLiteProvider } from 'expo-sqlite';
import { Home, PieChart, Settings } from 'lucide-react-native';

// 引入我们写好的文件
import HomeScreen from './src/screens/HomeScreen';
import StatsScreen from './src/screens/StatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { migrateDbIfNeeded } from './src/db/migrate';
import { COLORS } from './src/theme/colors';

const Tab = createBottomTabNavigator();

// 一个包装组件，用来处理 DB 初始化 loading 状态
function RootNavigator() {
  const db = useSQLiteContext();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function setup() {
      try {
        await migrateDbIfNeeded(db);
        console.log('Database migrated successfully');
        setIsReady(true);
      } catch (e) {
        console.error('Migration failed', e);
      }
    }
    setup();
  }, [db]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary }}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: COLORS.tabBarActive,
        tabBarInactiveTintColor: COLORS.tabBarInactive,
        tabBarShowLabel: false, // 只有图标，类似你的草图
      }}
    >
      <Tab.Screen 
        name="Stats" 
        component={StatsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <PieChart color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="Home" 
        options={{
          tabBarIcon: ({ color }) => (
            // 中间的大按钮效果
            <View style={{
              backgroundColor: COLORS.primary,
              width: 50,
              height: 50,
              borderRadius: 25,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10, // 稍微突起一点
              elevation: 4
            }}>
              <Home color="#2D3436" size={28} />
            </View>
          ),
        }}
      >
        {/* 将 db 对象传递给 HomeScreen */}
        {props => <HomeScreen {...props} db={db} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SQLiteProvider databaseName="kitty.db">
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SQLiteProvider>
  );
}