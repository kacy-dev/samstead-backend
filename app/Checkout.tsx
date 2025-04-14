import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { GestureHandlerRootView, ScrollView, TextInput } from 'react-native-gesture-handler'
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import colors from '@/components/colors'

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card')
  const { cartItems } = useLocalSearchParams();
  const cart = cartItems ? JSON.parse(cartItems as string) : [];

  // Sample delivery fee and discount
    const DELIVERY_FEE = 500;
    const DISCOUNT = 200;

    // Subtotal: sum of all item prices (assuming quantity is 1 per item for now)
    const subtotal = cart.reduce((sum: number, item: any) => {
    return sum + parseFloat(item.price);
    }, 0);

    // Total
    const total = subtotal + DELIVERY_FEE - DISCOUNT;


  return (
    <GestureHandlerRootView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b mt-12  gap-4 border-gray-200">
        <Ionicons name="arrow-back" size={24} onPress={() => router.back()}/>
        <Text className="text-xl text-center font-bold ml-3">Checkout</Text>
        <Text className="text-xl text-center font-semibold ml-3"></Text>
      </View>

      <ScrollView className="flex-1 px-4 mb-6">
        {/* Order Summary */}
        <Text className="text-base text-xl font-bold mt-4 mb-2">Order Summary</Text>

        {/* Product 1 */}
        {cart.map((item: any, index: number) => (
            <View key={index} className="flex-row justify-between items-start mt-4 mb-3">
                <View className="flex-row items-start">
                <Image
                    source={item.image}
                    className="w-16 h-16 rounded mr-3"
                    resizeMode='contain'
                />
                <View>
                    <Text className="font-semibold text-lg">{item.name}</Text>
                    <Text className="text-gray-500 font-semibold text-sm">{item.weight}g Pack</Text>
                    <Text className="text-green-700 font-bold mt-1">₦{parseFloat(item.price).toFixed(2)}</Text>
                </View>
                </View>
                <View className='flex-row items-center gap-2'>
                <AntDesign name='minus' size={16}/>
                <Text className="font-bold">1</Text>
                <AntDesign name='plus' size={16}/>
                </View>
            </View>
            ))}

        {/* Delivery Address */}
        <View className="border-t border-b border-gray-200 py-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base text-lg font-bold">Delivery Address</Text>
            <Text className="text-green-600 font-bold">Change</Text>
          </View>
          <View className="flex-row items-start">
            <Ionicons name="location-sharp" size={20} color="green" />
            <View className='ml-2'>
                <Text className="text-black font-bold w-4/5">Home</Text>
                <Text className='text-sm text-gray-600'>123 Victoria Island, Lagos</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View className="py-4 border-b border-gray-200">
          <Text className="text-base text-lg font-semibold mb-3">Payment Method</Text>

          {/* Credit Card Option */}
          <TouchableOpacity
            onPress={() => setPaymentMethod('card')}
            className={`flex-row items-center justify-between border rounded-lg p-4 mb-3 ${
              paymentMethod === 'card' ? 'border-green-500' : 'border-gray-300'
            }`}
          >
            <View className="flex-row items-center">
              <MaterialIcons name="credit-card" size={20} />
              <Text className="ml-2 font-semibold">Credit Card</Text>
            </View>
            <View
              className={`w-4 h-4 rounded-full border ${
                paymentMethod === 'card' ? 'bg-green-600 border-green-600' : 'border-gray-400'
              }`}
            />
          </TouchableOpacity>

          {/* Cash Option */}
          <TouchableOpacity
            onPress={() => setPaymentMethod('cash')}
            className={`flex-row items-center justify-between border rounded-lg p-4 ${
              paymentMethod === 'cash' ? 'border-green-500' : 'border-gray-300'
            }`}
          >
            <View className="flex-row items-center">
              <Ionicons name="cash-outline" size={20} />
              <Text className="ml-2 font-semibold">Cash on Delivery</Text>
            </View>
            <View
              className={`w-4 h-4 rounded-full border ${
                paymentMethod === 'cash' ? 'bg-green-600 border-green-600' : 'border-gray-400'
              }`}
            />
          </TouchableOpacity>
        </View>

        {/* Credit Card Inputs (only when card is selected) */}
        {paymentMethod === 'card' && (
          <View className="mb-4">
            <Text className="text-xl font-bold mb-6">Card Details</Text>

            <View className="mb-3">
              <Text className="text-xsm font-semibold mb-1">Card Number</Text>
              <TextInput 
              className='border py-4 px-4 border-gray-400 rounded-lg' 
              placeholder='**** **** **** 1234' 
              placeholderTextColor="gray"
              keyboardType='numeric'
              maxLength={17}
            />
            </View>

            <View className="flex-row justify-between gap-4 mb-3">
              <View className="flex-1">
                <Text className="text-xsm font-semibold mb-1">Expiry Date</Text>
                <TextInput 
                className='border py-4 px-4 border-gray-400 rounded-lg' 
                placeholder='12/24'
                placeholderTextColor="gray"
                keyboardType='numeric'
              />
              </View>
              <View className="flex-1">
                <Text className="text-xsm font-semibold mb-1">CVV</Text>
                <TextInput 
                className='border py-4 px-4 border-gray-400 rounded-lg' 
                placeholder='***' 
                placeholderTextColor="gray"
                keyboardType='numeric'
                maxLength={3}
              />
              </View>
            </View>

            <View className="mb-3">
              <Text className="text-xsm font-semibold mb-1">Card Pin</Text>
              <TextInput 
              className='border py-4 px-4 border-gray-400 rounded-lg' 
              placeholder='****' 
              placeholderTextColor="gray"
              keyboardType='numeric'
              maxLength={4}
            />
            </View>
          </View>
        )}


        {/* Price Summary */}
        <View className="py-4">
        <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600 font-semibold">Subtotal</Text>
            <Text className="text-gray-700 text-lg font-bold">₦{subtotal.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600 font-semibold">Delivery Fee</Text>
            <Text className="text-gray-700 text-lg font-bold">₦{DELIVERY_FEE.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600 font-semibold">Premium Discount</Text>
            <Text className="text-green-600 text-lg font-bold">−₦{DISCOUNT.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between pt-1">
            <Text className="text-base font-bold">Total</Text>
            <Text className="text-base text-lg font-bold">₦{total.toFixed(2)}</Text>
        </View>
        </View>


        {/* Estimated Delivery */}
        <View className="flex-row items-center mb-3 border-t border-gray-200 pt-2 justify-between">
          <View>
            <Text className="text-sm font-semibold text-gray-500">Estimated Delivery</Text>
            <Text className="text-black font-bold">Tomorrow, 10:00 AM - 2:00 PM</Text>
          </View>
          <AntDesign name='clockcircle' size={14} color={colors.primary}/>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View className="px-4 pb-5">
        <TouchableOpacity className="py-4 rounded-lg mb-4 items-center" 
        style={{backgroundColor: colors.primary}}
            onPress={() => {
                const transactionId = 'TXN' + Math.floor(100000 + Math.random() * 900000); // 6-digit random
                const now = new Date();
                const transactionDate = now.toLocaleDateString();
                const transactionTime = now.toLocaleTimeString();
            
                const recipientName = 'John Doe'; // Can be dynamic later
                const address = '123 Victoria Island, Lagos'; // Can be dynamic later
            
                router.push({
                pathname: '/Success',
                params: {
                    cartItems: JSON.stringify(cart),
                    subtotal: subtotal.toFixed(2),
                    total: total.toFixed(2),
                    deliveryFee: DELIVERY_FEE.toFixed(2),
                    discount: DISCOUNT.toFixed(2),
                    paymentMethod,
                    transactionId,
                    transactionDate,
                    transactionTime,
                    recipientName,
                    address,
                }
                });
            }}
          
          
        >
          <Text className="text-white font-semibold text-base">Place Order • ₦3,500</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  )
}

export default Checkout