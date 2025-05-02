import React from "react";
import { Alert, ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";

interface PaystackWebViewProps {
  email: string;
  amount: number; // Amount in Naira
  onSuccess?: (reference: string) => void;
}

const PaystackWebView: React.FC<PaystackWebViewProps> = ({
  email,
  amount,
  onSuccess,
}) => {
  const paystackPublicKey = "pk_test_d3a60265a49af403da62ebb911e30f155701b601";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Pay with Paystack</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <script src="https://js.paystack.co/v1/inline.js"></script>
        <script type="text/javascript">
          window.onload = function () {
            var handler = PaystackPop.setup({
              key: '${paystackPublicKey}',
              email: '${email}',
              amount: ${amount * 100},
              callback: function (response) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({ status: 'success', reference: response.reference })
                );
              },
              onClose: function () {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({ status: 'cancelled' })
                );
              },
            });
            handler.openIframe();
          };
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.status === "success") {
        console.log("Payment successful with reference:", data.reference);
        onSuccess?.(data.reference);
      } else if (data.status === "cancelled") {
        Alert.alert("Payment Cancelled");
      }
    } catch (error) {
      console.error("Failed to handle message from WebView:", error);
    }
  };

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html: htmlContent }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onMessage={handleMessage}
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
