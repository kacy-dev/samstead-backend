import { Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons'; // For icons (you may need to install @expo/vector-icons)
import colors from '@/components/colors';
import { router, useLocalSearchParams } from 'expo-router';

const Success = () => {
    const {
        transactionId,
        transactionDate,
        transactionTime,
        total,
        paymentMethod,
        recipientName,
        address,
      } = useLocalSearchParams();
      
    
  return (
    <View className="flex-1 bg-white items-center justify-center p-5">
      {/* Illustration Placeholder */}
      <View className="justify-center items-center mb-5" style={{marginTop: 'auto'}}>
        <Image source={require('../assets/images/success.png')} className='w-40 h-40' resizeMode='contain'/>
      </View>

      {/* Success Message */}
      <Text className="text-2xl font-bold text-black mb-3 text-center">
        Your order is made!
      </Text>
      <Text className="text-sm text-gray-600 font-semibold text-center mb-5 leading-5">
        Congratulations, your order has been successfully processed, we will deliver your order as soon as possible!
      </Text>

      {/* Transaction Details */}
      <View className="bg-gray-100  rounded-lg p-4 w-full mb-5">
        <View className="flex-row justify-between mb-3">
          <Text className="text-sm text-gray-600">Transaction ID</Text>
          <Text className="text-sm text-black font-medium text-right flex-1 ml-2">
          {transactionId}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm text-gray-600">Recipient Name</Text>
          <Text className="text-sm text-black font-medium text-right flex-1 ml-2">
          {recipientName}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm text-gray-600">Address</Text>
          <Text className="text-sm text-black font-medium text-right flex-1 ml-2">
            {address}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm text-gray-600">Date</Text>
          <Text className="text-sm text-black font-medium text-right flex-1 ml-2">
            {transactionDate} - {transactionTime}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm text-gray-600">Payment method</Text>
          <Text className="text-sm text-black font-medium text-right">
            {paymentMethod}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm text-gray-600">Total amount</Text>
          <Text className="text-sm text-black font-medium">
            {total}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm text-gray-600">Status</Text>
          <View style={{ borderColor: colors.primary, borderWidth: 1}} className="flex-row items-center p-1 rounded-full px-4 justify-end mt-3">
            <Ionicons name="checkmark-circle" size={12} color="#34C759" />
            <Text style={{color: colors.primary}} className="text-sm text-green-500 ml-1">
                Paid
            </Text>
        </View>
        </View>
        
      </View>

      {/* Buttons */}
      <View className="flex-row justify-between w-full mb-6" style={{marginTop: 'auto'}}>
        <TouchableOpacity
          className="flex-1 rounded-md py-4 items-center mr-3"
          style={{ borderWidth: 1, borderColor: colors.primary }}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={{color: colors.primary}} className="text-base text-green-500 font-semibold">
            Back to Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 rounded-md py-4 items-center"
          style={{backgroundColor: colors.primary}}
          onPress={() => router.push('/TrackOrder')}
        >
          <Text className="text-base text-white font-semibold">
            Track Order
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Success;