import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import colors from "@/components/colors";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Ensure the dependency is installed
import { push } from "expo-router/build/global-state/routing";
import { api } from "@/api";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(api("auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.message === "Login successful") {
        // Store the token and user data in AsyncStorage
        await AsyncStorage.setItem("auth_token", data.token); // Store the auth token
        await AsyncStorage.setItem("user_id", data.user.id.toString()); // Store user ID
        await AsyncStorage.setItem("user_name", data.user.full_name); // Store user name

        // // Optionally, store additional user details
        await AsyncStorage.setItem("user_email", data.user.email);
        await AsyncStorage.setItem(
          "user_phone",
          data.user.phone_number.toString()
        );
        await AsyncStorage.setItem("user_address", data.user.delivery_address);

        // Navigate to the main screen or dashboard
        router.push("/(tabs)"); // Replace with your actual navigation method
      } else {
        Alert.alert(data.message);
        console.log(data);
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-5 pt-10">
      {/* Logo & Close Icon */}
      <View className="flex-row justify-between items-center mb-4 mt-4">
        <Image
          source={require("../assets/icons/logo.png")} // Replace with your logo path
          className="w-20 h-20"
          resizeMode="contain"
        />
      </View>

      {/* Heading */}
      <Text className="text-2xl font-bold mb-1 text-center">Welcome Back</Text>
      <Text className="text-gray-500 text-lg font-semibold text-center mb-8">
        Login to your account
      </Text>

      {/* Password */}
      <Text className="text-lg text-gray-600 font-semibold mb-2">
        Email or Phone Number
      </Text>
      <View className="flex-row gap-4 items-center border border-gray-300 rounded-lg px-4 py-4 mb-4">
        <AntDesign name="mail" size={18} />
        <TextInput
          placeholder="Enter your email or phone"
          placeholderTextColor="gray"
          className="flex-1"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <Text className="text-lg text-gray-600 font-semibold mb-2">Password</Text>
      <View className="flex-row gap-4 items-center border border-gray-300 rounded-lg px-4 py-3 mb-4">
        <FontAwesome name="lock" color={"#666"} size={20} />
        <TextInput
          placeholder="Create a password"
          secureTextEntry
          className="flex-1"
          placeholderTextColor="gray"
          value={password}
          onChangeText={setPassword}
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
          <Text className="text-gray-500 text-lg font-semibold">
            Remember me
          </Text>
        </Pressable>

        <TouchableOpacity onPress={() => router.push("/ForgotPassword")}>
          <Text className="text-green-600 text-lg font-semibold">
            Forgot password?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Create Account Button */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity
          className="py-4 rounded-lg mb-6"
          style={{ backgroundColor: colors.primary }}
          onPress={handleLogin}
        >
          <Text className="text-white text-center text-lg font-semibold text-base">
            Login
          </Text>
        </TouchableOpacity>
      )}

      {/* Login Link */}
      <Text className="text-center text-lg font-semibold text-gray-500">
        Don't have an account?{" "}
        <Text
          onPress={() => router.push("/SignupScreen")} // Make sure this route exists
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
