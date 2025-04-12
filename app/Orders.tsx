import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { BellIcon } from 'react-native-heroicons/outline'
import { CheckCircleIcon, TruckIcon } from 'react-native-heroicons/solid'
import { AntDesign, Feather, FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'

const Orders = () => {
  return (
    <ScrollView className="flex-1 bg-['#f5f5f5'] px-4 pt-10">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6 mt-6">
        <Image
          source={require('@/assets/icons/logo.png')}
          className="w-36 h-16 rounded-full"
          resizeMode="contain"
        />
      </View>

      {/* Stats Cards */}
      <View className="flex-row justify-between mb-4">
        <View className="w-[48%] bg-white p-4 rounded-xl">
          <Text className="font-semibold text-gray-500">Today's Orders</Text>
          <Text className="text-2xl font-bold text-black mt-1">24</Text>
        </View>
        <View className="w-[48%] bg-white p-4 rounded-xl">
          <Text className="font-semibold text-gray-500">Pending Delivery</Text>
          <Text className="text-2xl font-bold text-black mt-1">12</Text>
        </View>
      </View>

      {/* Recent Orders Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-bold">Recent Orders</Text>
      </View>

      {/* Order Card 1 */}
      <View className="bg-white rounded-xl p-4 mb-4">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="font-bold text-black">#ORDER2025</Text>
          <View className="bg-yellow-200 px-2 py-1 rounded-full">
            <Text className="text-xs font-semibold text-yellow-800">Processing</Text>
          </View>
        </View>
        <Text className="text-gray-700 mb-1 font-semibold">Green Pepper</Text>
        <View className='flex-row items-center justify-between mt-2 mb-4' style={{borderBottomWidth: 1, borderColor: '#ddd', paddingBottom: 10}}>
          <Text className="font-semibold text-gray-500">15 items</Text>
          <Text className="font-bold text-lg text-black">₦25,000</Text>
        </View>
          <View className="flex-row items-center justify-between">
           <View className='items-center flex-row gap-2'>
            <MaterialCommunityIcons color={'red'} size={16} name='clock'/>
            <Text className="text-sm font-semibold text-red-600">Next Day Delivery</Text>
           </View>
            <TouchableOpacity onPress={() => router.push('/TrackOrder')} >
              <Text className="text-medium font-semibold text-green-700">View Details</Text>
            </TouchableOpacity>
          </View>
      </View>

      {/* Order Card 2 */}
      <View className="bg-white rounded-xl p-4 mb-4">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="font-bold text-black">#ORDER2025</Text>
          <View className="bg-blue-100 px-2 py-1 rounded-full">
            <Text className="text-xs font-semibold text-blue-800">Out for Delivery</Text>
          </View>
        </View>
        <Text className="text-gray-700 mb-1 font-semibold">Carrot</Text>
        <View className='flex-row items-center justify-between mt-2 mb-4' style={{borderBottomWidth: 1, borderColor: '#ddd', paddingBottom: 10}}>
          <Text className="font-semibold text-gray-500">8 items</Text>
          <Text className="font-bold text-lg text-black">₦12,500</Text>
        </View>
          <View className="flex-row items-center justify-between">
           <View className='items-center flex-row gap-2'>
            <MaterialCommunityIcons color={'green'} size={16} name='truck-delivery'/>
            <Text className="text-sm font-semibold text-green-600">Same Day Delivery</Text>
           </View>
            <TouchableOpacity onPress={() => router.push('/TrackOrder')} >
              <Text className="text-medium font-semibold text-green-700">View Details</Text>
            </TouchableOpacity>
          </View>
      </View>

      
    </ScrollView>
  )
}

export default Orders
