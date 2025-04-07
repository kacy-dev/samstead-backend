import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Pressable } from 'react-native';
import React, { useState } from 'react';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import colors from '@/components/colors';
import { StatusBar } from 'expo-status-bar';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [isChecked, setIsChecked] = useState(false);

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
      <Text className="text-2xl font-bold mb-1 text-center">Welcome Back</Text>
      <Text className="text-gray-500 text-lg font-semibold text-center mb-8">Login to your account</Text>


      {/* Password */}
      <Text className='text-lg text-gray-600 font-semibold mb-2'>Email or Phone Number</Text>
      <View className='flex-row gap-4 items-center border border-gray-300 rounded-lg px-4 py-4 mb-4'>
        <AntDesign name='mail' size={18}/>
        <TextInput
            placeholder="Enter your email or phone"
            secureTextEntry
            placeholderTextColor="gray"
        />
      </View>

      <Text className='text-lg text-gray-600 font-semibold mb-2'>Password</Text>
      <View className='flex-row gap-4 items-center border border-gray-300 rounded-lg px-4 py-3 mb-4'>
        <FontAwesome name='lock' color={'#666'} size={20}/>
        <TextInput
            placeholder="Create a password"
            secureTextEntry
            className=""
            placeholderTextColor="gray"
        />
      </View>
      <View className="flex-row justify-between items-center mb-6 mt-4">
      <Pressable
        onPress={() => setIsChecked(!isChecked)}
        className="flex-row items-center"
      >
        <View className="w-5 h-5 border border-gray-400 rounded mr-2 items-center justify-center bg-white">
          {isChecked && <Ionicons name="checkmark" size={14} color="green" />}
        </View>
        <Text className="text-gray-500 text-lg font-semibold">Remember me</Text>
      </Pressable>

      <Text className="text-green-600 text-lg font-semibold">Forgot password?</Text>
    </View>

      {/* Create Account Button */}
      <TouchableOpacity className="py-4 rounded-lg mb-6" style={{ backgroundColor: colors.primary }} onPress={() => navigation.navigate('(tabs)')}>
        <Text className="text-white text-center text-lg font-semibold text-base">Login</Text>
      </TouchableOpacity>

      {/* Login Link */}
      <Text className="text-center text-lg font-semibold text-gray-500">
        Already have an account?{' '}
        <Text
          onPress={() => navigation.navigate('SignupScreen')} // Make sure this route exists
          className="text-green-700 font-semibold"
        >
          Sign up
        </Text>
      </Text>
      <StatusBar style="dark" backgroundColor="white" />
    </ScrollView>
  );
};

export default LoginScreen;
