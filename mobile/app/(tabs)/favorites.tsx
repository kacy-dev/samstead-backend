import { useFavoriteStore } from '@/store/useFavoriteStore';
import { useProductStore } from '@/store/useProductStore';
import { router, useNavigation } from 'expo-router';
import React from 'react';
import { FlatList, Image, Text, View, TouchableOpacity } from 'react-native';

const favoriteItems = [
  {
    id: '1',
    name: 'Potatoes',
    price: '6700',
    oldPrice: '',
    weight: '500',
    image: require('@/assets/products/4.png'),
    description:
      'Premium organic tomatoes sourced directly from local Nigerian farms. These vine-ripened tomatoes are carefully selected for their superior taste and quality. Perfect for salads, cooking, or making fresh sauce.',
    calories: '22 Kcal/100g',
    protein: '1.1g',
    carbohydrates: '10g',
    vitaminC: '100mg',
    category: 'Dairy & Eggs',
  },
  {
    id: '2',
    name: 'Potatoes',
    price: '6700',
    oldPrice: '',
    weight: '500',
    image: require('@/assets/products/9.png'),
    description:
      'Premium organic tomatoes sourced directly from local Nigerian farms. These vine-ripened tomatoes are carefully selected for their superior taste and quality. Perfect for salads, cooking, or making fresh sauce.',
    calories: '22 Kcal/100g',
    protein: '1.1g',
    carbohydrates: '10g',
    vitaminC: '100mg',
    category: 'Dairy & Eggs',
  },
  {
    id: '3',
    name: 'Potatoes',
    price: '6700',
    oldPrice: '',
    weight: '500',
    image: require('@/assets/products/11.png'),
    description:
      'Premium organic tomatoes sourced directly from local Nigerian farms. These vine-ripened tomatoes are carefully selected for their superior taste and quality. Perfect for salads, cooking, or making fresh sauce.',
    calories: '22 Kcal/100g',
    protein: '1.1g',
    carbohydrates: '10g',
    vitaminC: '100mg',
    category: 'Dairy & Eggs',
  },
];

const favorites = () => {
  const navigation = useNavigation();
  
  const renderItem = ({ item }: any) => (
    <View className="flex-row bg-white rounded-xl p-4 mb-4 mx-4 items-center">
      <TouchableOpacity className="flex-row items-center flex-1"  onPress={() => {
                  useProductStore.getState().setSelectedProduct(item);
                  router.push('/ProductDetails');
                }}>
      <Image
        source={item.image}
        className="w-16 h-16 rounded-lg mr-4"
        resizeMode="contain"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
        <Text className="text-sm text-gray-500" numberOfLines={2}>{item.description}</Text>
      </View>
      </TouchableOpacity>
      <TouchableOpacity className="bg-red-500 rounded-full p-2">
        <Text className="text-white font-semibold">Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100 pt-12">
      <Text className="text-2xl font-bold text-gray-800 px-4 mb-4 mt-6">Your Favorites</Text>
      <FlatList
        data={favoriteItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
};

export default favorites;
