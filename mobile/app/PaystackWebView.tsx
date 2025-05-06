import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";
import { api } from "@/api";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PaystackWebView = () => {
  const { email: expectedEmail } = useLocalSearchParams();
  const { amount: expectedAmount } = useLocalSearchParams();
  const { for: expectedFor } = useLocalSearchParams();
  const { paymentMethod } = useLocalSearchParams();
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [reference, setReference] = useState("");

  const fetchCheckoutUrl = async () => {
    try {
      const name = await AsyncStorage.getItem("user_name");
      const address = await AsyncStorage.getItem("user_address");

      setName(name || "");
      setAddress(address || "");

      const res = await fetch(api("paystack/initialize"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: expectedEmail,
          amount: Number(expectedAmount) * 100,
        }),
      });

      const data = await res.json();

      setCheckoutUrl(data.result.data.authorization_url);
      setReference(data.result.data.reference);
    } catch (e) {
      console.log("Checkout init error:", e);
      Alert.alert("Error", "Unable to initiate Paystack transaction.");
    }
  };

  useEffect(() => {
    if (expectedEmail && typeof expectedEmail === "string") {
      setEmail(expectedEmail);
    }
  }, [expectedEmail]);

  useEffect(() => {
    if (expectedAmount && typeof expectedAmount === "string") {
      setAmount(expectedAmount);
    }
  }, [expectedAmount]);

  useEffect(() => {
    fetchCheckoutUrl();
  }, []);

  const handleVerify = async () => {
    try {
      if (expectedFor === "subs") {
        router.push({
          pathname: "/SubscriptionSuccess",
          params: {
            name: "John Doe",
            amount,
            reference: "1234567890",
            paymentTime: new Date().toLocaleString(),
          },
        });
      } else {
        console.log(reference);
        const response = await fetch(api(`paystack/verify/${reference}`), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: expectedFor,
          }),
        });

        const data = await response.json();

        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const router = useRouter();
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const handleNavigation = (navState: any) => {
    const { url } = navState;

    if (url.includes("example.com/verify")) {
      handleVerify();
    }
  };

  if (!checkoutUrl) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: checkoutUrl }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onNavigationStateChange={handleNavigation}
      onShouldStartLoadWithRequest={(request) => {
        if (request.url.includes("example.com/verify")) {
          handleVerify();
          return false;
        }
        return true;
      }}
      startInLoadingState={true}
      renderLoading={() => (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    />
  );
};

export default PaystackWebView;
