import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import React from 'react';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import colors from '@/components/colors';
import { StatusBar } from 'expo-status-bar';

const SignupScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-white px-5 pt-10">
      {/* Logo & Close Icon */}
      <View className="flex-row justify-between items-center mb-4 mt-4">
        <Image
          source={require('../assets/icons/logo.png')} // Replace with your logo path
          className="w-20 h-20"
          resizeMode="contain"
        />
        
      </View>

      {/* Heading */}
      <Text className="text-2xl font-bold mb-1 text-center">Create Account</Text>
      <Text className="text-gray-500 text-lg font-semibold text-center mb-8">Join Samstead for exclusive grocery deals</Text>

      {/* Full Name */}
      <Text className='text-lg text-gray-600 font-semibold'>Full Name</Text>
      <TextInput
        placeholder="Enter your full name"
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base text-black"
        placeholderTextColor="gray"
      />


      {/* Email */}
      <Text className='text-lg text-gray-600 font-semibold'>Email Address</Text>
      <TextInput
        placeholder="Enter your email"
        keyboardType="email-address"
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
        placeholderTextColor="gray"
      />

      {/* Phone Number */}
      <Text className='text-lg text-gray-600 font-semibold'>Phone Number</Text>
      <View className="flex-row items-center border border-gray-300 rounded-lg px-2 py-0 mb-4">
        <View style={{ width: 70, borderRightWidth: 1, borderColor: '#ddd', paddingHorizontal: 10 }} className="flex-row items-center py-3 justify-center mr-2">
            <Text className="mr-2 text-base">+234</Text>
            <Ionicons name="chevron-down" size={16} color="gray" />
        </View>
        <TextInput
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          className="flex-1 text-base"
          placeholderTextColor="gray"
        />
      </View>

      {/* Delivery Address */}
      <Text className='text-lg text-gray-600 font-semibold'>Delivery Address</Text>
      <TextInput
        placeholder="Enter your delivery address"
        multiline
        className="h-32 border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base text-black"
        placeholderTextColor="gray"
        />


      {/* Password */}
      <Text className='text-lg text-gray-600 font-semibold'>Password</Text>
      <View className='flex-row justify-between items-center border border-gray-300 rounded-lg px-4 py-3 mb-4'>
        <TextInput
            placeholder="Create a password"
            secureTextEntry
            placeholderTextColor="gray"
        />
        <AntDesign name='eyeo' size={18}/>
      </View>
      <Text className="text-gray-500 text-sm font-semibold mb-6">Must be at least 8 characters long</Text>

      {/* Create Account Button */}
      <TouchableOpacity className="py-4 rounded-lg mb-6" style={{ backgroundColor: colors.primary }} onPress={() => navigation.navigate('OtpVerification')}>
        <Text className="text-white text-center font-semibold text-base">Create Account</Text>
      </TouchableOpacity>

      {/* Login Link */}
      <Text className="text-center text-lg text-gray-500">
        Already have an account?{' '}
        <Text
          onPress={() => navigation.navigate('LoginScreen')} // Make sure this route exists
          className="text-green-700 font-medium"
        >
          Log in
        </Text>
      </Text>
      <StatusBar style="dark" backgroundColor="white" />
    </ScrollView>
  );
};

export default SignupScreen;
