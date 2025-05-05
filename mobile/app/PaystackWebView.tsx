import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";
import { api } from "@/api";

interface Props {
  email: string;
  amount: number;
}

const PaystackWebView: React.FC<Props> = ({ email, amount }) => {
  const router = useRouter();
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCheckoutUrl = async () => {
      try {
        const res = await fetch(api("paystack/initialize"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "believeosawaru@gmail.com",
            amount: 1000 * 100,
          }),
        });

        const data = await res.json();
        console.log(data.result.data.authorization_url);
        setCheckoutUrl(data.result.data.authorization_url);
      } catch (e) {
        console.log("Checkout init error:", e);
        Alert.alert("Error", "Unable to initiate Paystack transaction.");
      }
    };

    fetchCheckoutUrl();
  }, []);

  const handleNavigation = (navState: any) => {
    const { url } = navState;
    console.log("Navigated to:", url);

    // Watch for callback URL
    if (url.includes("example.com/verify")) {
      router.push({
        pathname: "/SubscriptionSuccess",
        params: {
          name: "John Doe",
          amount,
          reference: "1234567890",
          paymentTime: new Date().toLocaleString(),
        },
      });
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
          router.push("/SubscriptionSuccess");
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
