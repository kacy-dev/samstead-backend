import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { WebView } from "react-native-webview";
import { api } from "@/api";

const CheckoutScreen = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  // Initialize Payment Process
  const handleConfirm = async () => {
    setLoading(true);

    try {
      const response = await axios.post(api("paystack/initialize"), {
        email, // Replace with real user email
        amount: 5000, // 5000 kobo = ₦50
        name,
      });

      const { authorization_url, reference } = response.data.result.data;
      setReference(reference);
      setCheckoutUrl(authorization_url); // Launch Paystack WebView
    } catch (error) {
      console.log("Payment initialization error:", error);
      alert("Failed to initialize payment.");
    } finally {
      setLoading(false);
    }
  };

  // Handle navigation state change in the WebView
  const handleWebViewNavigationStateChange = async (navState: any) => {
    const { url } = navState;
    console.log("Navigating to URL:", url);

    // Paystack callback URL (make sure your redirect URL is correctly set in Paystack)
    if (url.includes("paystack.com")) {
      // Look for the success redirect URL from Paystack
      if (url.includes("status=success")) {
        // Payment was successful
        alert("Payment successful!");

        try {
          // Verify the payment with your backend
          const verifyRes = await axios.post(api("paystack/verify"), {
            reference,
          });

          if (verifyRes.data.status === "success") {
            alert("Payment confirmed!");
            router.push("/SubscriptionSuccess"); // Redirect to success page
          } else {
            alert("Payment verification failed");
          }
        } catch (error) {
          console.error("Verification error:", error);
          alert("Failed to verify payment.");
        }
      } else {
        // Payment failed or was cancelled
        alert("Payment failed or canceled.");
      }
    }
  };

  // Cancel the payment process and go back
  const handleCancel = () => {
    router.back(); // Go back to the previous screen
  };

  if (checkoutUrl) {
    return (
      <WebView
        source={{ uri: checkoutUrl }}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
      />
    );
  }

  // Show payment form if WebView is not yet loaded
  return (
    <ScrollView className="flex-1 bg-white px-5 pt-12">
      <TouchableOpacity
        onPress={handleCancel}
        className="mb-12 flex-row items-center gap-2 mt-6"
      >
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text className="text-lg font-bold">Back</Text>
      </TouchableOpacity>

      <Text className="text-2xl font-bold mb-1">Card Payment</Text>
      <Text className="text-sm text-gray-500 mb-6">Pay securely with card</Text>

      <Text className="font-semibold text-black mb-1">Name on Card</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g., Saad Shaikh"
        className="border border-gray-300 rounded-md px-4 py-3 mb-6"
        placeholderTextColor="gray"
      />

      <Text className="font-semibold text-black mb-1">Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="e.g., saadshaikh@gmail.com"
        className="border border-gray-300 rounded-md px-4 py-3 mb-6"
        placeholderTextColor="gray"
      />

      <TouchableOpacity
        onPress={handleConfirm}
        className="bg-green-800 py-4 rounded-md mb-3"
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-white font-semibold">
            Submit Order
          </Text>
        )}
      </TouchableOpacity>

      <Text className="text-xs text-gray-500 text-center mb-6">
        By clicking submit, you agree to our Terms and Privacy Policy.
      </Text>

      <TouchableOpacity
        onPress={handleCancel}
        className="border border-gray-400 py-3 rounded-md mb-4"
      >
        <Text className="text-center text-black text-lg font-semibold">
          Cancel Order
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CheckoutScreen;
