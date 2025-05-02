import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import colors from "@/components/colors";
import SuccessModal from "@/components/SuccessModal";
import { api } from "@/api";

const OtpVerification = () => {
  const { user_id, otp: expectedOtp } = useLocalSearchParams();
  const inputs = useRef<Array<TextInput | null>>([]);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State for controlling modal visibility

  // useEffect(() => {
  //   if (
  //     expectedOtp &&
  //     typeof expectedOtp === "string" &&
  //     expectedOtp.length === 4
  //   ) {
  //     setOtp(expectedOtp.split(""));
  //   }
  // }, [expectedOtp]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < inputs.current.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleOtpVerification = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 4) {
      alert("Please enter the complete OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(api("auth/verify-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user_id,
          otpCode: otpCode,
        }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      // Check for success message in the response
      if (data.message === "OTP verified successfully") {
        // Optionally, store the token if needed
        // const token = data.token;
        // You can store the token in AsyncStorage or context if necessary
        // AsyncStorage.setItem('userToken', token);

        // Navigate to the LoginScreen
        router.push("/Pricing");
      } else {
        alert("Incorrect OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      const response = await fetch(
        "https://samstead.loma.com.ng/api/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("OTP resent successfully!");
        setResendTimer(30);
        setCanResend(false);
      } else {
        alert(data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      alert("An error occurred while resending OTP.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-6">
      {/* Logo */}
      <View className="w-full flex-row items-center justify-center mt-12">
        <Image
          source={require("../assets/icons/logo.png")}
          className="w-24 h-20"
          resizeMode="contain"
        />
      </View>

      {/* Success Icon */}
      <View className="w-full flex-row items-center justify-center mt-8 mb-6">
        <Image
          source={require("../assets/icons/up.png")}
          className="w-20 h-20"
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <Text className="text-2xl font-bold text-center mb-2">
        Verify Your Account
      </Text>
      <Text className="text-gray-500 text-lg font-semibold text-center mb-6">
        Please enter the verification code sent to your{"\n"}email/phone
      </Text>

      {/* OTP Boxes */}
      <View className="flex-row justify-between w-full px-2 mb-6">
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
              borderColor: "#ccc",
              borderRadius: 8,
              textAlign: "center",
              fontSize: 30,
              backgroundColor: "#fff",
              fontWeight: "bold",
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
          {loading ? "Verifying..." : "Verify Now"}
        </Text>
      </TouchableOpacity>

      {/* Resend Text */}
      <Text className="text-gray-500 text-lg font-semibold text-center">
        Didn't receive the code?{" "}
        <Text
          onPress={handleResendOtp}
          className={`text-lg font-semibold ${
            canResend ? "text-green-600" : "text-gray-400"
          }`}
        >
          Resend
        </Text>
      </Text>
      <Text className="text-gray-400 text-xl font-semibold text-center mt-1">
        {canResend
          ? "You can resend the code now"
          : `You can resend code in ${resendTimer} seconds`}
      </Text>
    </ScrollView>
  );
};

export default OtpVerification;
