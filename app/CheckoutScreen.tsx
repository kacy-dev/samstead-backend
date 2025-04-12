import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const CheckoutScreen = () => {
  const router = useRouter()

  const [name, setName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  const handleConfirm = () => {
    // Proceed to success screen or payment handling
    router.push('/SubscriptionSuccess')
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <ScrollView className="flex-1 bg-white px-5 pt-12">
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} className="mb-12 flex-row items-center gap-2 mt-6">
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text className='text-lg font-bold'>Back</Text>
      </TouchableOpacity>

      {/* Heading */}
      <Text className="text-2xl font-bold mb-1">Payment Details</Text>
      <Text className="text-sm text-gray-500 mb-6">Purchase options</Text>

      {/* Name on Card */}
      <Text className="font-semibold text-black mb-1">Name on card</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Saad Shaikh"
        className="border border-gray-300 rounded-md px-4 py-3 mb-6"
        placeholderTextColor="gray"

      />

      {/* Card Number */}
      <Text className="font-semibold text-black mb-1">Card Number</Text>
      <TextInput
        value={cardNumber}
        onChangeText={setCardNumber}
        placeholder="xxxx  xxxx  xxxx  xxxx"
        keyboardType="numeric"
        className="border border-gray-300 rounded-md px-4 py-3 mb-6"
        placeholderTextColor="gray"

      />

      {/* Expiration Date & CVV */}
      <View className="flex-row justify-between mb-6">
        <View className="w-[48%]">
          <Text className="font-semibold text-black mb-1">Expiration Date</Text>
          <TextInput
            value={expiry}
            onChangeText={setExpiry}
            placeholder="mm/yy"
            className="border border-gray-300 rounded-md px-4 py-3"
            keyboardType="numeric"
          placeholderTextColor="gray"

          />
        </View>
        <View className="w-[48%]">
          <Text className="font-semibold text-black mb-1">CVV</Text>
          <TextInput
            value={cvv}
            onChangeText={setCvv}
            placeholder="***"
            className="border border-gray-300 rounded-md px-4 py-3"
            keyboardType="numeric"
            secureTextEntry
            placeholderTextColor="gray"
          />
        </View>
      </View>

      {/* Submit Order Button */}
      <TouchableOpacity
        onPress={handleConfirm}
        className="bg-green-800 py-4 rounded-md mb-3"
      >
        <Text className="text-center text-white font-semibold">Submit order</Text>
      </TouchableOpacity>

      {/* Terms */}
      <Text className="text-xs text-gray-500 text-center mb-6">
        By clicking submit order, you agree to our Terms and Privacy Policy.
      </Text>

      {/* Cancel Button */}
      <TouchableOpacity
        onPress={handleCancel}
        className="border border-gray-400 py-3 rounded-md mb-4"
      >
        <Text className="text-center text-black text-lg font-semibold">Cancel order</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default CheckoutScreen
