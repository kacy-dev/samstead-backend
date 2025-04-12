import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import colors from '@/components/colors';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';


const SignupScreen = () => {
  const [full_name, setFull_Name] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone_number, setPhone_Number] = useState('');
  const [delivery_address, setDelivery_Address] = useState('');
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validate inputs
    if (!full_name || !email || !phone_number || !delivery_address || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill in all fields',
        position: 'top',
      });
      
      return;
    }

    setLoading(true); // Start loading
    try {
      const response = await fetch('https://samstead.loma.com.ng/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name, email, phone_number, delivery_address, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      console.log('Message:', data.message);
      console.log('User ID:', data.user_id);
      console.log('OTP Code:', data.otp_code);

      // Check if the message indicates successful registration
      if (data.message === 'User registered successfully. Please verify your OTP.') {
        console.log('Navigating to OtpVerification...');
        login(data.user, data.token);
      
        router.push({
          pathname: '/OtpVerification',
          params: {
            user_id: data.user_id?.toString() || '',
            otp: data.otp_code?.toString() || '',
            user: JSON.stringify(data.user), // Pass the user object as a string
          },
        });

        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: `Code: ${data.otp_code || 'Not provided'}`,
          position: 'top',
        });
        
      } else {
        console.log('Registration failed:', data.message);
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: data.message || 'An error occurred',
          position: 'top',
        });
        
      }
    } catch (error) {
      console.error('Register error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred. Please try again.',
        position: 'top',
      });
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-5 pt-10">
      {/* Logo & Close Icon */}
      <View className="flex-row justify-center items-center mt-4">
        <Image
          source={require('../assets/icons/logo.png')} // Replace with your logo path
          className="w-20 h-20"
          resizeMode="contain"
        />
      </View>

      {/* Heading */}
      <Text className="text-2xl font-bold mb-1 text-center">Create Account</Text>
      <Text className="text-gray-500 text-lg font-semibold text-center mb-8">
        Join Samstead for exclusive grocery deals
      </Text>

      {/* Full Name */}
      <Text className="text-lg text-gray-600 font-semibold">Full Name</Text>
      <TextInput
        placeholder="Enter your full name"
        className="border border-gray-300 rounded-lg px-4 h-14 mb-4 text-base text-black"
        placeholderTextColor="gray"
        value={full_name}
        onChangeText={setFull_Name}
      />

      {/* Email */}
      <Text className="text-lg text-gray-600 font-semibold">Email Address</Text>
      <TextInput
        placeholder="Enter your email"
        keyboardType="email-address"
        className="border border-gray-300 rounded-lg px-4 h-14 mb-4 text-base"
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      {/* Phone Number */}
      <Text className="text-lg text-gray-600 font-semibold">Phone Number</Text>
      <View className="flex-row items-center border border-gray-300 rounded-lg px-2 py-0 mb-4">
        <View
          style={{ width: 70, borderRightWidth: 1, borderColor: '#ddd', paddingHorizontal: 10 }}
          className="flex-row items-center h-14 justify-center mr-2"
        >
          <Text className="mr-2 text-base">+234</Text>
          <Ionicons name="chevron-down" size={16} color="gray" />
        </View>
        <TextInput
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          className="flex-1 text-base"
          placeholderTextColor="gray"
          value={phone_number}
          onChangeText={setPhone_Number}
        />
      </View>

      {/* Delivery Address */}
      <Text className="text-lg text-gray-600 font-semibold">Delivery Address</Text>
      <TextInput
        placeholder="Enter your delivery address"
        multiline
        className="h-32 border border-gray-300 rounded-lg px-4 h-14 mb-4 text-base text-black"
        placeholderTextColor="gray"
        value={delivery_address}
        onChangeText={setDelivery_Address}
      />

      {/* Password */}
      <Text className="text-lg text-gray-600 font-semibold">Password</Text>
      <View className="flex-row justify-between items-center border border-gray-300 rounded-lg px-4 h-14 mb-4">
        <TextInput
          placeholder="Create a password"
          secureTextEntry
          placeholderTextColor="gray"
          className="flex-1"
          value={password}
          onChangeText={setPassword}
        />
        <AntDesign name="eyeo" size={18} />
      </View>
      <Text className="text-gray-500 text-sm font-semibold mb-6">
        Must be at least 8 characters long
      </Text>

      {/* Create Account Button */}
      <TouchableOpacity
        className="py-4 rounded-lg mb-6 flex-row justify-center"
        style={{ backgroundColor: colors.primary }}
        onPress={() => router.push('/OtpVerification')}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold text-base">
            Create Account
          </Text>
        )}
      </TouchableOpacity>

      {/* Login Link */}
      <Text className="text-center text-lg text-gray-500 mb-10">
        Already have an account?{' '}
        <Text
          onPress={() => router.push('/LoginScreen')}
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