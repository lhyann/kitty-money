// src/screens/HomeScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  FlatList, Keyboard, TouchableWithoutFeedback, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FolderOpen, Plus, Coffee, ShoppingBag, Utensils } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';

import { COLORS, STYLES } from '../theme/colors';
import * as Transactions from '../db/transactions';
import * as Categories from '../db/categories';

// 简单的分类图标映射 (MVP阶段先写死几个用于展示)
const ICON_MAP = {
  '饮料': <Coffee size={20} color={COLORS.textMain} />,
  '食物': <Utensils size={20} color={COLORS.textMain} />,
  '其他': <ShoppingBag size={20} color={COLORS.textMain} />,
};

export default function HomeScreen({ db }) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [recentList, setRecentList] = useState([]);

  // 1. 加载数据
  const loadData = async () => {
    if (!db) return;
    try {
      // 加载分类
      const cats = await Categories.listCategories(db);
      setCategories(cats);
      if (cats.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(cats[0].id); // 默认选中第一个
      }

      // 加载最近流水
      const trans = await Transactions.listTransactions(db, { limit: 10 });
      setRecentList(trans);
    } catch (e) {
      console.error(e);
    }
  };

  // 每次页面获得焦点时刷新数据
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [db])
  );

  // 2. 提交记账
  const handleSave = async () => {
    if (!amount) return;
    
    // 把 "10.5" 转成 1050 (分)
    const amountInCents = Math.round(parseFloat(amount) * 100);

    try {
      await Transactions.createTransaction(db, {
        amount: amountInCents,
        type: 'expense', // 目前默认是支出
        categoryId: selectedCategoryId,
        note: note || '没什么特别的',
      });

      // 重置表单并刷新列表
      setAmount('');
      setNote('');
      Keyboard.dismiss();
      loadData();
    } catch (e) {
      Alert.alert("出错啦", "记账失败了喵...");
      console.error(e);
    }
  };

  // 渲染列表项
  const renderItem = ({ item }) => (
    <View style={styles.recordItem}>
      <View style={styles.recordIcon}>
         {/* 尝试匹配图标，没有就显示默认 */}
         {ICON_MAP[item.category_name] || <ShoppingBag size={20} color="#555"/>}
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.recordNote}>{item.note || item.category_name}</Text>
        <Text style={styles.recordDate}>
          {new Date(item.occurred_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </Text>
      </View>
      <Text style={styles.recordAmount}>-{(item.amount / 100).toFixed(2)}</Text>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        
        {/* 顶部：日期与欢迎语 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>今天</Text>
          <Text style={styles.headerSubtitle}>{new Date().toLocaleDateString()} · 别乱花钱哦</Text>
        </View>

        {/* 中间：输入卡片 (对应Mockup中间的大方块) */}
        <View style={styles.inputCard}>
          
          {/* 分类选择行 (横向滚动) */}
          <View style={styles.categoryRow}>
            <FlatList 
              horizontal 
              showsHorizontalScrollIndicator={false}
              data={categories}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.catBadge, 
                    selectedCategoryId === item.id && styles.catBadgeActive
                  ]}
                  onPress={() => setSelectedCategoryId(item.id)}
                >
                  <Text style={styles.catText}>{item.icon} {item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* 金额输入 (大字体) */}
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholderTextColor="#BDC3C7"
            />
          </View>

          {/* 备注输入 */}
          <TextInput
            style={styles.noteInput}
            placeholder="备注：买了什么好吃的？"
            value={note}
            onChangeText={setNote}
          />

          {/* 确认按钮 */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>记一笔</Text>
            <Plus size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* 底部：近期记录 (对应Mockup下方的列表) */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>最近记录</Text>
          <FlatList
            data={recentList}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={{textAlign: 'center', color: '#888', marginTop: 20}}>
                还没有记录，快喂我吃数据！
              </Text>
            }
          />
        </View>

      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary, // 薄荷绿背景
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800', // 类似手绘的粗体
    color: COLORS.textMain,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textMain,
    opacity: 0.7,
  },
  // 输入大卡片
  inputCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: STYLES.radius,
    padding: 20,
    ...STYLES.shadow,
    marginBottom: 25,
  },
  categoryRow: {
    marginBottom: 15,
    height: 40,
  },
  catBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#F0F2F5',
    marginRight: 10,
    justifyContent: 'center',
  },
  catBadgeActive: {
    backgroundColor: COLORS.accent, // 选中变色
  },
  catText: {
    fontSize: 14,
    color: COLORS.textMain,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#F0F0F0',
  },
  currencySymbol: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 40, // 巨大的金额输入
    fontWeight: 'bold',
    color: COLORS.textMain,
    paddingVertical: 10,
  },
  noteInput: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  saveBtn: {
    backgroundColor: COLORS.textMain, // 深色按钮对比度高
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  // 列表区域
  listContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.textMain,
  },
  recordItem: {
    backgroundColor: 'rgba(255,255,255,0.6)', // 半透明白
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordIcon: {
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#FFF',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  recordNote: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textMain,
  },
  recordDate: {
    fontSize: 12,
    color: COLORS.textSub,
    marginTop: 2,
  },
  recordAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
});