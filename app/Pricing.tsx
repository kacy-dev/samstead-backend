import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign, Entypo } from '@expo/vector-icons'
import colors from '@/components/colors'
import { router } from 'expo-router';


const Pricing = () => {
  return (
    <ScrollView className="flex-1 bg-white">
      {/* Logo and Menu */}
      <View className="flex-row items-center p-4 mt-8">
        <Image source={require('../assets/icons/logo.png')} className="h-24 w-24 " resizeMode="contain" />
      </View>

      {/* Title Section */}
      <View className="px-4 py-0">
        <Text className="text-xl font-bold text-black">Exclusive Membership Benefits</Text>
        <Text className="text-sm text-gray-600 mt-1">
          Choose the perfect plan for your premium shopping experience
        </Text>
      </View>

      {/* Premium Membership */}
      <View className="bg-green-100 border border-green-600 mx-4 rounded-xl mt-4" style={{height: 425
      }}>
        <View className='bg-green-700 px-4 py-2' style={{borderTopLeftRadius: 9, borderTopRightRadius: 9}}>
        <Text className="text-lg font-bold text-white">Premium Membership</Text>
        <Text className="text-2xl font-bold text-white mt-2">₦1,000 <Text className="text-sm font-semibold">/month</Text></Text>
        <Text className="text-sm font-bold text-white mb-3">or ₦10,000/year</Text>
        </View>

        <View className="space-y-2 mb-2">
          {[
            "Full product range access with standard prices",
            "Daily deals and seasonal offers updates",
            "Order tracking and customer support",
            "Free delivery on orders above ₦100,000",
            "Loyalty rewards points system"
          ].map((item, index) => (
            <Text key={index} className="text-gray-700 font-semibold px-4 mt-6"><Entypo name='check' color={colors.primary} size={18}/> {item}</Text>
          ))}
        </View>

        <TouchableOpacity className="bg-green-700 mt-8 rounded-lg py-4" style={{width: '90%', alignSelf: 'center'}} onPress={() => router.push('/CheckoutScreen')}>
          <Text className="text-center text-white font-semibold">Select Premium</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-purple-100 border border-purple-700 mx-4 rounded-xl mt-4 mb-10" style={{height: 450
      }}>
        <View className='bg-purple-700 px-4 py-2' style={{borderTopLeftRadius: 9, borderTopRightRadius: 9}}>
        <Text className="text-lg font-bold text-white">Elite Membership</Text>
        <Text className="text-2xl font-bold text-white mt-2">₦3,000 <Text className="text-sm font-semibold">/month</Text></Text>
        <Text className="text-sm font-bold text-white mb-3">or ₦30,000/year</Text>
        </View>

        <View className="space-y-2 mb-2">
          {[
            "All Premium benefits included",
            "One free delivery per month",
            "Priority order processing",
            "Exclusive produce items access",
            "Dedicated service concierge",
            "Enhanced cashback rewards"
          ].map((item, index) => (
            <Text key={index} className="text-gray-700 font-semibold px-4 mt-6"><Entypo name='check' color={'purple'} size={18}/> {item}</Text>
          ))}
        </View>

        <TouchableOpacity className="bg-purple-700 mt-8 rounded-lg py-4" style={{width: '90%', alignSelf: 'center'}}>
          <Text className="text-center text-white font-semibold">Select Premium</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default Pricing
