import { Text, View, TextInput, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons, Feather, Entypo, FontAwesome, AntDesign } from '@expo/vector-icons';
import { useProductStore } from '@/store/useProductStore';
import Toast from 'react-native-root-toast';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useFavoriteStore } from '../store/useFavoriteStore'; // adjust path if needed


const products = [
  {
    name: 'Fresh Tomatoes',
    price: '1200',
    oldPrice: '1500',
    weight: '100',
    image: require('@/assets/products/1.png'),
    description:
      'Premium organic tomatoes sourced directly from local Nigerian farms. These vine-ripened tomatoes are carefully selected for their superior taste and quality. Perfect for salads, cooking, or making fresh sauce.',
    calories: '22 Kcal/100g',
    protein: '1.1g',
    carbohydrates: '10g',
    vitaminC: '100mg',
    category: 'Dairy & Eggs',
  },
  {
    name: 'Bell Peppers',
    price: '900',
    oldPrice: '2500',
    weight: '500',
    image: require('@/assets/products/7.png'),
    description:
      'Premium organic tomatoes sourced directly from local Nigerian farms. These vine-ripened tomatoes are carefully selected for their superior taste and quality. Perfect for salads, cooking, or making fresh sauce.',
    calories: '22 Kcal/100g',
    protein: '1.1g',
    carbohydrates: '10g',
    vitaminC: '100mg',
    category: 'Meat & Poultry',
  },
  {
    name: 'Potatoes',
    price: '6700',
    oldPrice: '',
    weight: '500',
    image: require('@/assets/products/8.png'),
    description:
      'Premium organic tomatoes sourced directly from local Nigerian farms. These vine-ripened tomatoes are carefully selected for their superior taste and quality. Perfect for salads, cooking, or making fresh sauce.',
    calories: '22 Kcal/100g',
    protein: '1.1g',
    carbohydrates: '10g',
    vitaminC: '100mg',
    category: 'Seafood',
  },
  {
    name: 'Potatoes',
    price: '6700',
    oldPrice: '',
    weight: '500',
    image: require('@/assets/products/5.png'),
    description:
      'Premium organic tomatoes sourced directly from local Nigerian farms. These vine-ripened tomatoes are carefully selected for their superior taste and quality. Perfect for salads, cooking, or making fresh sauce.',
    calories: '22 Kcal/100g',
    protein: '1.1g',
    carbohydrates: '10g',
    vitaminC: '100mg',
    category: 'Bakery',
  },
  {
    name: 'Potatoes',
    price: '6700',
    oldPrice: '',
    weight: '500',
    image: require('@/assets/products/2.png'),
    description:
      'Premium organic tomatoes sourced directly from local Nigerian farms. These vine-ripened tomatoes are carefully selected for their superior taste and quality. Perfect for salads, cooking, or making fresh sauce.',
    calories: '22 Kcal/100g',
    protein: '1.1g',
    carbohydrates: '10g',
    vitaminC: '100mg',
    category: 'Pantry Staples',
  },
  {
    name: 'Potatoes',
    price: '6700',
    oldPrice: '',
    weight: '500',
    image: require('@/assets/products/3.png'),
    description:
      'Premium organic tomatoes sourced directly from local Nigerian farms. These vine-ripened tomatoes are carefully selected for their superior taste and quality. Perfect for salads, cooking, or making fresh sauce.',
    calories: '22 Kcal/100g',
    protein: '1.1g',
    carbohydrates: '10g',
    vitaminC: '100mg',
    category: 'Beverages',
  },
    {
    name: 'Potatoes',
    price: '6700',
    oldPrice: '',
    weight: '500',
    image: require('@/assets/products/2.png'),
    description:
      'Premium organic tomatoes sourced directly from local Nigerian farms. These vine-ripened tomatoes are carefully selected for their superior taste and quality. Perfect for salads, cooking, or making fresh sauce.',
    calories: '22 Kcal/100g',
    protein: '1.1g',
    carbohydrates: '10g',
    vitaminC: '100mg',
    category: 'Dairy',
  },
  {
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
    category: 'Fruits',
  },
  {
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
    category: 'Vegetables',
  },
  {
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
    category: 'Meat',
  },
  {
    name: 'Potatoes',
    price: '6700',
    oldPrice: '',
    weight: '500',
    image: require('@/assets/products/2.png'),
    description:
      'Premium organic tomatoes sourced directly from local Nigerian farms. These vine-ripened tomatoes are carefully selected for their superior taste and quality. Perfect for salads, cooking, or making fresh sauce.',
    calories: '22 Kcal/100g',
    protein: '1.1g',
    carbohydrates: '10g',
    vitaminC: '100mg',
    category: 'Pantry Staples',
  },
  {
    name: 'Potatoes',
    price: '6700',
    oldPrice: '',
    weight: '500',
    image: require('@/assets/products/3.png'),
    description:
      'Premium organic tomatoes sourced directly from local Nigerian farms. These vine-ripened tomatoes are carefully selected for their superior taste and quality. Perfect for salads, cooking, or making fresh sauce.',
    calories: '22 Kcal/100g',
    protein: '1.1g',
    carbohydrates: '10g',
    vitaminC: '100mg',
    category: 'Beverages',
  },
    {
    name: 'Potatoes',
    price: '6700',
    oldPrice: '',
    weight: '500',
    image: require('@/assets/products/2.png'),
    description:
      'Premium organic tomatoes sourced directly from local Nigerian farms. These vine-ripened tomatoes are carefully selected for their superior taste and quality. Perfect for salads, cooking, or making fresh sauce.',
    calories: '22 Kcal/100g',
    protein: '1.1g',
    carbohydrates: '10g',
    vitaminC: '100mg',
    category: 'Dairy',
  },
  {
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

const ProductList = () => {
  const navigation = useNavigation();
    const { category } = useLocalSearchParams<{ category: string }>();
  const cart = useProductStore((state) => state.cart);
  const filteredProducts = products.filter((item) => item.category === category);

  const favorites = useFavoriteStore((state) => state.favorites);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const isFavorited = useFavoriteStore((state) => state.isFavorited);
  

  return (
    <View className="flex-1" style={{ backgroundColor: '#f6f6f6' }}>
      {/* Header */}
        <View className="flex-row items-center justify-between mb-3 mt-12 p-4">
          <View className="flex-row items-center gap-2">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-black">
            {category || 'Category'}
            </Text>
          </View>
          
          <View className="flex-row items-center gap-4">
            <FontAwesome name="filter" size={24} color="#000" />
            
            <TouchableOpacity
              onPress={() => navigation.navigate('Cart')}
              style={styles.cartIconContainer}
            >
              <Ionicons name="cart-outline" size={28} color="black" />
              {cart.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cart.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>


      {/* Search Input */}
      <View className="mb-4 bg-white p-4">
        <View className='flex-row bg-gray-100 items-center p-3 rounded-lg gap-2'>
          <AntDesign name="search1" size={20} color="#999" />
          <TextInput
              placeholder="Search vegetables..."
              placeholderTextColor="#999"
              className='flex-1'
          />
      </View>
    </View>

      {/* Product Grid */}
      <ScrollView showsVerticalScrollIndicator={false} className="mb-4 p-4">
  {filteredProducts.length === 0 ? (
    <View className="items-center justify-center h-96" style={{top: 80}}>
        <Ionicons name="cart-outline" size={64} color="#ccc" />
        <Text className="mt-4 text-lg font-semibold text-gray-500">No product available in this category</Text>
    </View>
  ) : (
    <View className="flex-row flex-wrap justify-between">
      {filteredProducts.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            useProductStore.getState().setSelectedProduct(item);
            navigation.navigate('ProductDetails');
          }}
          className="bg-white p-4 rounded-lg mb-4"
          style={{ width: '48%' }}
        >
          <Image source={item.image} className="w-full h-20 rounded-lg mb-3 mt-2" resizeMode="contain" />
          <View className="flex-row items-center justify-between mt-2">
            <Text className="font-bold text-lg flex-1">{item.name}</Text>
            <TouchableOpacity>
              <Ionicons name='heart-outline' size={22}/>
            </TouchableOpacity>
          </View>
          <Text className="text-gray-500 text-lg font-semibold">{item.weight}g Pack</Text>

          <View className="flex-row justify-between items-center mt-4">
            <View>
              <Text className="text-lg font-bold text-green-600">
                ₦{parseFloat(item.price).toFixed(2)}
              </Text>
              {item.oldPrice && (
                <Text className="text-gray-500 line-through">
                  ₦{parseFloat(item.oldPrice).toFixed(2)}
                </Text>
              )}
            </View>
            <TouchableOpacity
              className="p-2 rounded-lg w-10 h-12 justify-center items-center"
              style={{ backgroundColor: '#058044' }}
              onPress={() => {
                useProductStore.getState().addToCart(item);
                Toast.show(`${item.name} added to cart`, {
                  duration: Toast.durations.SHORT,
                  position: Toast.positions.BOTTOM,
                });
              }}
            >
              <FontAwesome name="plus" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )}
</ScrollView>


    </View>
  );
};

export default ProductList;

const styles = StyleSheet.create({
    cartIconContainer: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -10,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
})
