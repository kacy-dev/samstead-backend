import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useProductStore } from '@/store/useProductStore';
import { router, useNavigation } from 'expo-router';

const Cart = () => {
  const cart = useProductStore((state) => state.cart);
  const removeFromCart = useProductStore((state) => state.removeFromCart);
  const navigation = useNavigation();

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount).replace("NGN", "₦");
  };
  

  const deliveryFee = 500;

  // 🧮 Calculate subtotal
  const subtotal = cart.reduce((total, item) => {
    const price = parseFloat(item.price);
    return total + (isNaN(price) ? 0 : price);
  }, 0);

  // 💰 Total price = subtotal + deliveryFee
  const total = subtotal + deliveryFee;

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: '#f6f6f6' }}>
      <View className="flex-row items-center mb-6 mt-16 px-4">
        <Ionicons name="arrow-back" size={22} onPress={() => navigation.goBack()} />
        <Text className="ml-2 text-base text-lg font-bold">Shopping Cart ({cart.length})</Text>
      </View>

      {cart.length === 0 ? (
        <View className="items-center justify-center h-96" style={{top: 200}}>
          <Ionicons name="cart-outline" size={64} color="#ccc" />
          <Text className="mt-4 text-lg font-semibold text-gray-500">No product added</Text>
        </View>
      ) : (
        <>
          <View className="flex-row p-3 rounded-md mb-5 items-start mx-4" style={{ backgroundColor: '#FFEAC4' }}>
            <Ionicons name="alert-circle" size={20} color="#ffa500" />
            <Text className="ml-2 text-lg font-semibold" style={{ color: '#BD7E0A', width: '90%' }}>
              Order within 2 hours 35 minutes for delivery today. Orders after 4:00 PM will be delivered tomorrow.
            </Text>
          </View>

          {cart.map((item, i) => (
            <View
              key={i}
              className="flex-row items-center mb-0 bg-white p-4 mt-6 rounded-lg"
              style={{ width: '92%', alignSelf: 'center' }}
            >
              <Image source={item.image} className="w-36 h-32 rounded-md mr-2" style={{ resizeMode: 'contain' }} />

              <View className="flex-1 justify-between">
                <View className="flex-row justify-between items-start">
                  <Text className="font-semibold  pr-4" style={{fontSize: 16}}>{item.name}</Text>
                  <TouchableOpacity
                    className="rounded "
                    onPress={() => removeFromCart(i)}
                  >
                    <Ionicons name="trash" size={22} color="#777" />
                  </TouchableOpacity>
                </View>
                <Text className="text-gray-500 font-semibold text-lg">{item.weight}g Pack</Text>
                <View className="flex-row items-center justify-between mt-2">
                  <Text className="text-green-600 font-bold" style={{flex: 1, fontSize: 16}}>{formatPrice(parseFloat(item.price))}</Text>
                  <View className="flex-row items-center justify-between bg-gray-100 rounded-lg" style={{ width: 80, padding: 8 }}>
                    <TouchableOpacity className="rounded">
                      <AntDesign name="minus" size={18} />
                    </TouchableOpacity>
                    <Text className="mx-2">1</Text>
                    <TouchableOpacity className="rounded ">
                      <AntDesign name="plus" size={18} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}

          {/* Order Summary */}
          <View className="bg-gray-100 p-4 my-4 mt-6 bg-white mb-4" style={{ borderTopWidth: 1, borderTopColor: '#ccc',}}>
            <Text className="font-semibold text-lg mb-3">Order Summary</Text>
            <View className="flex-row justify-between mb-2 items-center">
              <Text className="text-gray-600  font-semibold">Subtotal</Text>
              <Text className="text-black font-semibold text-lg">{formatPrice(subtotal)}</Text>
            </View>
            <View
              className="flex-row justify-between mb-4"
              style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 10 }}
            >
              <Text className="text-gray-600 font-semibold">Delivery Fee</Text>
              <Text className="text-black font-semibold text-lg">{formatPrice(deliveryFee)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-bold text-lg">Total</Text>
              <Text className="font-bold text-green-600 text-lg">{formatPrice(total)}</Text>
            </View>
          </View>

          <TouchableOpacity className="bg-green-600 py-4 rounded-lg mb-10" style={{ width: '92%', alignSelf: 'center' }} 
          onPress={() => router.push({
            pathname: '/Checkout',
            params: {
              cartItems: JSON.stringify(cart), // 👈 stringify the array before passing
            },
          })}
          
          >
            <Text className="text-white font-semibold text-center" style={{fontSize: 16}}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default Cart;
