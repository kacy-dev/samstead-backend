import React, { useState } from 'react';
import { Text, View, TextInput, ScrollView, Image, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Ionicons, Feather, Entypo, FontAwesome, AntDesign } from '@expo/vector-icons';
import Toast from 'react-native-root-toast';
import { router, useNavigation } from 'expo-router';
import { useProductStore } from '@/store/useProductStore';
import Modal from 'react-native-modal'; 

// Categories for the dropdown
const categories = ['All', 'Dairy & Eggs', 'Meat & Poultry', 'Seafood', 'Bakery'];
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

const AllProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const navigation = useNavigation();
  const cart = useProductStore((state) => state.cart);


  // Filter logic
  const filteredProducts = products.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchPrice =
      (!priceRange.min || parseFloat(item.price) >= parseFloat(priceRange.min)) &&
      (!priceRange.max || parseFloat(item.price) <= parseFloat(priceRange.max));
    return matchSearch && matchCategory && matchPrice;
  });

  return (
    <View className="flex-1" style={{ backgroundColor: '#f6f6f6' }}>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3 mt-12 p-4">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-black">Products</Text>
        </View>

        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
            <FontAwesome name="filter" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/Cart')} style={styles.cartIconContainer}>
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
        <View className="flex-row bg-gray-100 items-center p-0 h-12 px-3 rounded-lg gap-2">
          <AntDesign name="search1" size={20} color="#999" />
          <TextInput
            placeholder="Search products..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1"
          />
        </View>
      </View>

      {/* Product List */}
      <ScrollView className="p-4">
        <View className="flex-row flex-wrap justify-between">
          {filteredProducts.map((item, index) => (
            <TouchableOpacity
            key={index}
            onPress={() => {
              useProductStore.getState().setSelectedProduct(item);
              router.push('/ProductDetails');
            }}
            className="bg-white p-4 rounded-lg mb-4"
            style={{ width: '48%' }}
          >
            <Image
              source={item.image}
              className="w-full h-20 rounded-lg mb-3 mt-2"
              resizeMode="contain"
            />
            <View className="flex-row items-center justify-between mt-2">
              <Text className="font-bold text-lg flex-1">{item.name}</Text>
              <TouchableOpacity>
                <Ionicons name="heart-outline" size={22} />
              </TouchableOpacity>
            </View>
            <Text className="text-gray-500 text-lg font-semibold">
              {item.weight}g Pack
            </Text>

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
      </ScrollView>

      {/* Filter Modal */}
      

<Modal
  isVisible={isFilterModalVisible}
  onBackdropPress={() => setFilterModalVisible(false)}
  style={{ justifyContent: 'flex-end', margin: 0 }}
  avoidKeyboard={true} // important to let Modal adjust for keyboard
>
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 5 : 0} // adjust if needed
  >
    <View
      style={{
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
    >
      <Text className="text-2xl font-bold mb-4">Filter Products</Text>

      {/* Category Filter */}
      <Text className="mb-2 text-lg font-semibold">Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.chip,
              selectedCategory === cat && { backgroundColor: '#058044' },
            ]}
          >
            <Text
              style={{
                color: selectedCategory === cat ? '#fff' : '#000',
              }}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Price Filter */}
      <Text className="mt-4 text-lg mb-2 font-semibold">Price Range</Text>
      <View className="flex-row gap-4">
        <TextInput
          keyboardType="numeric"
          placeholder="Min"
          value={priceRange.min}
          onChangeText={(val) =>
            setPriceRange((prev) => ({ ...prev, min: val }))
          }
          style={styles.priceInput}
          placeholderTextColor="gray"
        />
        <TextInput
          keyboardType="numeric"
          placeholder="Max"
          value={priceRange.max}
          onChangeText={(val) =>
            setPriceRange((prev) => ({ ...prev, max: val }))
          }
          style={styles.priceInput}
          placeholderTextColor="gray"
        />
      </View>

      {/* Apply Button */}
      <TouchableOpacity
        onPress={() => setFilterModalVisible(false)}
        className="bg-green-700 py-4 rounded-xl mt-6 items-center"
      >
        <Text className="text-white text-lg font-semibold">Apply Filters</Text>
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
</Modal>
    </View>
  );
};

export default AllProducts;

const styles = StyleSheet.create({
  cartIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
  },
});
