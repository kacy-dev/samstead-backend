import { Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";

const SubscriptionSuccess = () => {
  const { name, amount, reference, paymentTime } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white justify-center items-center px-4">
      <View className="w-full bg-white rounded-2xl p-6 ">
        {/* Success Icon */}
        <View className="items-center mb-4">
          <Image
            source={require("../assets/icons/success.png")}
            className="w-20 h-20 "
            resizeMode="contain"
          />
        </View>

        {/* Success Text */}
        <Text className="text-center text-base font-medium text-black mb-1">
          Subscription Success!
        </Text>
        <Text className="text-center text-xl font-bold text-black mb-4">
          NGN {amount}
        </Text>

        <View className="h-px bg-gray-200 my-2" />

        {/* Details */}
        <View className="flex-row justify-between my-1 mb-6">
          <Text className="text-sm text-gray-500">Ref Number</Text>
          <Text className="text-sm text-gray-800">{reference}</Text>
        </View>

        <View className="flex-row justify-between my-1 mb-6">
          <Text className="text-sm text-gray-500">Payment Time</Text>
          <Text className="text-sm text-gray-800">{paymentTime}</Text>
        </View>

        <View className="flex-row justify-between my-1 mb-6">
          <Text className="text-sm text-gray-500">Payment Method</Text>
          <Text className="text-sm font-semibold text-gray-800">Card</Text>
        </View>

        <View className="flex-row justify-between my-1 mb-6">
          <Text className="text-sm text-gray-500">Sender Name</Text>
          <Text className="text-sm font-semibold text-gray-800">{name}</Text>
        </View>

        <View className="flex-row justify-between my-1 mb-6">
          <Text className="text-sm text-gray-500">Amount</Text>
          <Text className="text-sm font-semibold text-gray-800">
            NGN {amount}
          </Text>
        </View>

        <View className="flex-row justify-between my-1 mb-6">
          <Text className="text-sm text-gray-500">Admin Fee</Text>
          <Text className="text-sm font-semibold text-gray-800">
            NGN 500.00
          </Text>
        </View>
      </View>
      <TouchableOpacity
        className="bg-green-800 py-4 mt-12 rounded-md mb-3 w-full"
        onPress={() => router.push("/LoginScreen")}
      >
        <Text className="text-center text-white font-semibold">
          Back to Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SubscriptionSuccess;
