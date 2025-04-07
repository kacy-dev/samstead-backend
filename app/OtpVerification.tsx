import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useRef, useState } from 'react';
import colors from '@/components/colors';
import { router } from 'expo-router';
import { supabase } from '../supabaseClient'; // Import Supabase client

const OtpVerification = () => {
  const inputs = useRef<Array<TextInput | null>>([]);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < inputs.current.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '') {
      if (index > 0) {
        inputs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleOtpVerification = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 4) {
      alert('Please enter the complete OTP.');
      return;
    }

    setLoading(true);

    try {
      // Assuming you have a function in Supabase to verify OTP (usually for email/phone verification)
      const { data, error } = await supabase.auth.verifyOtp({ 
        email: "user@example.com", // Use actual user email
        token: otpCode,
        type: 'signup' // or 'email'
      });

      if (error) {
        console.error('Error verifying OTP:', error.message);
        alert('Verification failed. Please try again.');
        setLoading(false);
        return;
      }

      // Handle successful verification
      console.log('OTP verified successfully:', data);
      router.push('/(tabs)'); // Navigate to the home screen (or any other screen)
    } catch (error) {
      console.error('Error during OTP verification:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-6">
      {/* Logo */}
      <View className="w-full flex-row items-center justify-between mt-12">
        <Image
          source={require('../assets/icons/logo.png')} // Replace with actual logo
          className='w-24 h-20'
          resizeMode="contain"
        />
      </View>

      {/* Success Icon */}
        <View className="w-full flex-row items-center justify-center mt-8 mb-6">
            <Image
            source={require('../assets/icons/up.png')} // Replace with actual success icon
            className='w-20 h-20'
            resizeMode="contain"
            />
        </View>

      {/* Title */}
      <Text className="text-2xl font-bold text-center mb-2">Verify Your Account</Text>
      <Text className="text-gray-500 text-lg font-semibold text-center mb-6">
        Please enter the verification code sent to your{'\n'}email/phone
      </Text>

      {/* OTP Boxes */}
      <View className="flex-row justify-between w-full px-8 mb-6">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            style={{
              width: 65,
              height: 65,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              textAlign: 'center',
              fontSize: 30,
              backgroundColor: '#fff',
              fontWeight: 'bold'
            }}
          />
        ))}
      </View>

      {/* Verify Now Button */}
      <TouchableOpacity 
        className="py-4 px-8 rounded-md w-full mb-4" 
        style={{ backgroundColor: colors.primary }} 
        onPress={handleOtpVerification}
        disabled={loading}
      >
        <Text className="text-white text-center text-lg text-base font-semibold">
          {loading ? 'Verifying...' : 'Verify Now'}
        </Text>
      </TouchableOpacity>

      {/* Resend text */}
      <Text className="text-gray-500 text-lg font-semibold text-center">
        Didn't receive the code?{' '}
        <Text className="text-green-600 text-lg font-semibold">Resend</Text>
      </Text>
      <Text className="text-gray-400 text-xl font-semibold text-center mt-1">You can resend code in 30 seconds</Text>
    </ScrollView>
  );
};

export default OtpVerification;
