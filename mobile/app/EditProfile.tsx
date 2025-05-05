import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker"; // For image upload
import { Ionicons } from "@expo/vector-icons"; // For icons (e.g., dropdown arrows)
import { router } from "expo-router";
import { api } from "@/api";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProfile = () => {
  // State for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [country, setCountry] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDetails = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");

      if (!userId) {
        console.log("User ID not found in AsyncStorage");
        return;
      }

      const response = await fetch(api(`user/fetch-user/${userId}`), {
        method: "GET",
      });

      const data = await response.json();
      console.log(data);

      setName(data.data.name);
      setEmail(data.data.email);
      setPhone(data.data.phoneNumber.toString());
      setDeliveryAddress(data.data.deliveryAddress);
      setCountry(data.data.country);

      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  // Function to handle profile image upload
  const pickImage = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Function to handle saving changes (you can add API call here)
  const handleSaveChanges = async () => {
    if (!name || !email || !phone || !deliveryAddress || !country) {
      return Toast.show({
        type: "error",
        text1: "All fields must have a value",
        position: "top",
      });
    }

    setLoading(true);

    try {
      const userId = await AsyncStorage.getItem("user_id");

      if (!userId) {
        console.log("User ID not found in AsyncStorage");
        return;
      }

      const response = await fetch(api(`user/edit-profile/${userId}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phoneNumber: phone,
          deliveryAddress,
          country,
        }),
      });

      const data = await response.json();

      if (data.message === "User Profile Edited Successfully") {
        Toast.show({
          type: "success",
          text1: "Profile Edited Successfully",
          position: "top",
        });

        router.push("/(tabs)/account");
      } else {
        Toast.show({
          type: "error",
          text1: "There was an error editing profile",
          position: "top",
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-4 mt-8">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">Edit Profile</Text>
        <View className="w-6" />
      </View>

      {/* Profile Image */}
      <View className="items-center mt-6">
        <TouchableOpacity onPress={pickImage} className="relative">
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("../assets/icons/Avatars.png") // Replace with your default image
            }
            className="w-28 h-28 rounded-full border-2 border-gray-300"
            resizeMode="contain"
          />
          {/* Camera Icon Overlay */}
          <View className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-3">
            <Ionicons name="camera" size={16} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View className="px-4 mt-8">
        {/* Name */}
        <Text className="text-gray-600 text-lg font-bold mb-2">Name</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base text-black"
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="gray"
        />

        {/* Email */}
        <Text className="text-gray-600 text-lg font-bold mb-2">Email</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base text-black"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="gray"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* phone */}
        <Text className="text-gray-600 text-lg font-bold mb-2">
          Phone number
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base text-black"
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter your phone number"
          placeholderTextColor="gray"
        />

        {/* Date of Birth */}
        <Text className="text-gray-600 text-lg font-bold mb-2">
          Delivery Address
        </Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 mb-4">
          <TextInput
            className="flex-1 text-base text-black"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            placeholder="Update Address"
            placeholderTextColor="gray"
          />
        </View>

        {/* Country/Region */}
        <Text className="text-gray-600 text-lg font-bold mb-2">
          Country/Region
        </Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 mb-6">
          <TextInput
            className="flex-1 text-base text-black"
            value={country}
            onChangeText={setCountry}
            placeholder="Select your country"
            placeholderTextColor="gray"
          />
        </View>

        {/* Save Changes Button */}
        <TouchableOpacity
          className="bg-green-900 py-4 rounded-lg items-center mb-6"
          onPress={handleSaveChanges}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text className="text-white text-base font-semibold">
              Save Changes
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditProfile;
