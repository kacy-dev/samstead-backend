// CategoriesScreen.tsx
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Ionicons, MaterialIcons, Feather, FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

const categoriesData = [
  { name: 'Dairy & Eggs', desc: 'Fresh dairy products', icon: require('../../assets/products/1.png'), bg: '#EAF4FF' },
  { name: 'Meat & Poultry', desc: 'Fresh meat cuts', icon: require('../../assets/products/2.png'), bg: '#FFECEC' },
  { name: 'Seafood', desc: 'Fresh fish & seafood', icon: require('../../assets/products/3.png'), bg: '#E6FAF8' },
  { name: 'Bakery', desc: 'Fresh baked goods', icon: require('../../assets/products/4.png'), bg: '#FFF5E0' },
  { name: 'Pantry Staples', desc: 'Essential groceries', icon: require('../../assets/products/5.png'), bg: '#FFF3D9' },
  { name: 'Beverages', desc: 'Drinks & juices', icon: require('../../assets/products/6.png'), bg: '#F6F0FF' },
];

const categories = () => {
  return (
    <ScrollView className='flex-1 px-4 py-2' style={styles.container}>
      <StatusBar style="dark" backgroundColor="#f8f8f8" />
      {/* Header */}
      <View className='flex-row items-center justify-between mt-16 mb-12'>
        <View className='flex-row items-center gap-2'>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/Search')}>
          <Ionicons name="search" size={22} />
        </TouchableOpacity>
      </View>

      {/* Highlighted Categories */}
      <View style={styles.highlightRow}>
        <View className='flex-row items-center justify-between'
        style={[styles.highlightCard, { backgroundColor: '#C6F5DE' }]}>
          <View>
            <Text className='text-lg font-bold'>Fresh{"\n"}Organic</Text>
            <Text className='text-sm text-gray-500 font-semibold'>20+ Items</Text>
          </View>
          <FontAwesome name="leaf" size={30} color="#218A5E" />
        </View>
        <View className='flex-row items-center justify-between'
        style={[styles.highlightCard, { backgroundColor: '#FCEAD2' }]}>
          <View>
            <Text className='text-lg font-bold'>Fruits & Veg</Text>
            <Text className='text-sm text-gray-500 font-semibold'>50+ Items</Text>
          </View>
          <FontAwesome name="apple" size={30} color="#F29B1D" />
        </View>
      </View>
      {/* All Categories */}
      <Text className='text-2xl font-bold mb-8'>All Categories</Text>
      {categoriesData.map((item, index) => (
        <TouchableOpacity
        key={index}
        className="flex-row items-center mb-4 p-6 bg-white rounded-lg"
        onPress={() => router.push({ pathname: '/ProductList', params: { category: item.name } })}
      >
      
          <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
            <Image source={item.icon} style={styles.iconImage} />
          </View>
          <View style={{ flex: 1 }}>
            <Text className='text-lg font-semibold'>{item.name}</Text>
            <Text className='text-sm '>{item.desc}</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#aaa" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default categories;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 50,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  highlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  highlightCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
  },
  itemCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  allCategoriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoryItem: {
    
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  catTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  catDesc: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});
