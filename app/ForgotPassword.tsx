import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import colors from '@/components/colors';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Ensure the dependency is installed

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
  
    // const handleLogin = async () => {
    //   if (!email || !password) {
    //     Alert.alert('Error', 'Please enter both email and password.');
    //     return;
    //   }
  
    //   setLoading(true);
  
    //   try {
    //     const response = await fetch('https://samstead.loma.com.ng/api/login', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         email,
    //         password,
    //       }),
    //     });
  
    //     const data = await response.json();
  
    //     if (data.message === 'Login successful') {
    //       // Store the token and user data in AsyncStorage
    //       await AsyncStorage.setItem('auth_token', data.token);  // Store the auth token
    //       await AsyncStorage.setItem('user_id', data.user.id.toString());  // Store user ID
    //       await AsyncStorage.setItem('user_name', data.user.full_name);  // Store user name
  
    //       // Optionally, store additional user details
    //       await AsyncStorage.setItem('user_email', data.user.email);
    //       await AsyncStorage.setItem('user_phone', data.user.phone_number);
    //       await AsyncStorage.setItem('user_address', data.user.delivery_address);
  
    //       // Navigate to the main screen or dashboard
    //       router.push('/(tabs)'); // Replace with your actual navigation method
    //     } else {
    //       Alert.alert('Login Failed', data.message || 'An error occurred during login.');
    //     }
    //   } catch (error) {
    //     console.error('Login Error:', error);
    //     Alert.alert('Error', 'An error occurred. Please try again later.');
    //   } finally {
    //     setLoading(false);
    //   }
    // };

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
      <Text className="text-2xl font-bold mb-1 text-center">Forgot Password?</Text>
      <Text className="text-gray-500 text-lg font-semibold text-center mb-8">Reset your password</Text>


      {/* Password */}
      <Text className='text-lg text-gray-600 font-semibold mb-2'>Email address</Text>
      <View className='flex-row gap-4 items-center border border-gray-300 rounded-lg px-4 py-4 mb-4'>
        <AntDesign name='mail' size={18}/>
        <TextInput
          placeholder="Enter your email or phone"
          placeholderTextColor="gray"
          className="flex-1"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Create Account Button */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
      <TouchableOpacity className="py-4 rounded-lg mb-6" style={{ backgroundColor: colors.primary }}  onPress={() => router.push('/ResetOtpVerification')}>
        <Text className="text-white text-center text-lg font-semibold text-base">Continue</Text>
      </TouchableOpacity>
      )}
      <StatusBar style="dark" backgroundColor="white" />
    </ScrollView>
  );
};

export default ForgotPassword;