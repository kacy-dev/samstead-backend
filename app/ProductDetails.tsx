import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Ionicons, MaterialIcons, Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useProductStore } from '@/store/useProductStore';
import Header from '@/components/Header';
import Toast from 'react-native-root-toast';

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const product = useProductStore((state) => state.selectedProduct);

  if (!product) {
    return <Text>No product selected.</Text>;
  }

  const formatPrice = (price: string | number) => {
    // Ensure price is always a number
    return typeof price === 'string' ? parseFloat(price).toFixed(2) : price.toFixed(2);
  };

  return (
    <View className="flex-1 bg-white p-4">
        <Header/>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Product Image and Top Icons */}
      <View className="relative mb-10">
        <Image
          source={product.image}
          className="w-full h-40 rounded-xl"
          resizeMode="contain"
        />
        </View>
        <View style={{padding: 2, position: 'absolute', top: 10, left: 0}} className="absolute top-4 bg-green-600 w-20 p-1 right-4 flex-row justify-center items-start rounded-full">
            <Text className='text-center text-sm p-1 text-white font-semibold'>20% OFF</Text>
        </View>


        {/* Product Title, Weight & Price */}
        <View className="flex-row justify-between items-center mb-2">
            <View>
                <Text className="text-2xl font-bold">{product.name}</Text>
                <Text className="text-sm font-semibold text-gray-500">{product.weight}</Text>
            </View>
            
            <View className="items-end">
                <Text className="text-2xl font-bold text-green-600">₦{formatPrice(product.price)}</Text>
                {product.oldPrice && (
                    <Text style={{ textAlign: 'right' }} className="text-sm text-gray-400 line-through self-end font-semibold">
                    ₦{formatPrice(product.oldPrice)}
                    </Text>
                )}
        </View>
        </View>

      {/* Stock Info & Ratings */}
      <View className="flex-row items-center space-x-2 mt-2 mb-2">
        <Ionicons name="checkmark-circle" size={16} color="green" />
        <Text className="text-green-600 font-semibold text-sm">In Stock (50+ units)</Text>
      </View>
      <View className="flex-row items-center space-x-1 mt-1">
        <FontAwesome name="star" size={14} color="#facc15" />
        <FontAwesome name="star" size={14} color="#facc15" />
        <FontAwesome name="star" size={14} color="#facc15" />
        <FontAwesome name="star" size={14} color="#facc15" />
        <FontAwesome name="star-half-full" size={14} color="#facc15" />
        <Text className="text-sm text-gray-500 font-semibold ml-1">(128 reviews)</Text>
      </View>

      {/* Description */}
      <Text className="text-base text-lg font-bold mt-4 mb-1">Description</Text>
      <Text className="text-sm text-gray-600 leading-relaxed mb-2">
        Premium organic tomatoes sourced directly from local Nigerian farms.
        These vine-ripened tomatoes are carefully selected for their superior
        taste and quality. Perfect for salads, cooking, or making fresh sauce.
      </Text>

      {/* Nutritional Info */}
      <Text className="text-base text-lg font-bold mt-2 mb-2">Nutritional Information</Text>
      <View className="flex-row flex-wrap justify-between mb-2">
        <View>
            <View className="bg-gray-100 rounded-lg p-4 mb-3" style={{width: 160}}>
            <Text className="text-sm text-gray-500">Calories</Text>
            <Text className="text-base font-semibold">22 kcal/100g</Text>
            </View>

            <View className=" bg-gray-100 rounded-lg p-4 mb-3" style={{width: 160}}>
            <Text className="text-sm text-gray-500">Carbohydrate</Text>
            <Text className="text-base font-semibold">1.1g</Text>
            </View>
        </View>

        <View>
            <View className=" bg-gray-100 rounded-lg p-4 mb-3" style={{width: 160}}>
            <Text className="text-sm text-gray-500">Protein</Text>
            <Text className="text-base font-semibold">4.8g</Text>
            </View>
            <View className=" bg-gray-100 rounded-lg p-4 mb-3" style={{width: 160}}>
            <Text className="text-sm text-gray-500">Vitamin C</Text>
            <Text className="text-base font-semibold">14mg</Text>
            </View>
        </View>
        </View>


      {/* Delivery Info */}
      <View className="bg-green-100 p-3 rounded-lg flex-row space-x-2 items-start mt-1 mb-2">
        <MaterialCommunityIcons name="truck-delivery" size={18} color="green" />
        <Text className="text-sm text-green-800 flex-1 font-semibold text-green-600 px-6">
          Orders placed before 4 PM will be delivered today. Orders after 4 PM
          will be delivered tomorrow.
        </Text>
      </View>

      {/* Quantity & Add to Cart */}
      <View className="flex-row items-center justify-between mt-4 mb-4 btw-1">
        <View className="flex-row items-center space-x-2 bg-gray-100 p-4 px-6 py-6 gap-2 rounded-lg">
          <TouchableOpacity
            onPress={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))}
            className="px-3 rounded-md"
          >
            <AntDesign name='minus' size={18}/>
          </TouchableOpacity>
          <Text className="text-base font-semibold">{quantity}</Text>
          <TouchableOpacity
            onPress={() => setQuantity(prev => prev + 1)}
            className="px-3 rounded-md"
          >
            <AntDesign name='plus' size={18}/>
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="bg-green-600 px-4 py-6 rounded-lg p-4"
          onPress={() => {
            useProductStore.getState().addToCart({
              ...product,
            });

            Toast.show(`${product.name} added to cart`, {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM,
            });
          }}
        >
          <Text className="text-white font-semibold">Add to Cart - ₦{formatPrice(product.price)}</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetails;
