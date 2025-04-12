// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://egajntwinfinzgfgrriy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnYWpudHdpbmZpbnpnZmdycml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5ODQ4NDYsImV4cCI6MjA1OTU2MDg0Nn0.6lvn2nyfUo_6PYngHP0GfjL7Z02B_2-oycmhoG6vZbs';

export const supabase = createClient(supabaseUrl, supabaseKey);

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Ensure the dependency is installed
import { router } from 'expo-router'; // You can adjust this according to your routing method

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://samstead.loma.com.ng/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.message === 'Login successful') {
        // Store the token and user data in AsyncStorage
        await AsyncStorage.setItem('auth_token', data.token);  // Store the auth token
        await AsyncStorage.setItem('user_id', data.user.id.toString());  // Store user ID
        await AsyncStorage.setItem('user_name', data.user.full_name);  // Store user name

        // Optionally, store additional user details
        await AsyncStorage.setItem('user_email', data.user.email);
        await AsyncStorage.setItem('user_phone', data.user.phone_number);
        await AsyncStorage.setItem('user_address', data.user.delivery_address);

        // Navigate to the main screen or dashboard
        router.push('/(tabs)'); // Replace with your actual navigation method
      } else {
        Alert.alert('Login Failed', data.message || 'An error occurred during login.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <TextInput
        style={{
          height: 50,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 15,
          paddingHorizontal: 10,
        }}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={{
          height: 50,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 15,
          paddingHorizontal: 10,
        }}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: '#4CAF50', padding: 15, borderRadius: 5 }}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default LoginScreen;
