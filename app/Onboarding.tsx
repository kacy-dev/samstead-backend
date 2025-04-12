import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/components/colors';

const images = [
  require('../assets/images/banner2.png'),
  require('../assets/images/banner3.png'),
  require('../assets/images/banner1.png'),
];

const Onboarding = () => {
  const [bgIndex, setBgIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      fadeOut(() => {
        setBgIndex((prev) => (prev + 1) % images.length);
        fadeIn();
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const fadeOut = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start(callback);
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease),
    }).start();
  };

  return (
    <View className="flex-1">
      <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: fadeAnim }]}>
        <ImageBackground
          source={images[bgIndex]}
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
        >
          {/* Overlay */}
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.55)' }]} />
        </ImageBackground>
      </Animated.View>

      <SafeAreaView className="flex-1 justify-between px-5 py-6">
        {/* Top Row */}
        <View className="flex-row justify-between items-center">
          <Image
            source={require('../assets/icons/logo.png')}
            style={{ width: 85, height: 30, resizeMode: 'contain' }}
          />
          <TouchableOpacity onPress={() => router.push('/(tabs)')}>
            <Text className="text-white text-lg font-medium">Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Middle Text */}
        <View className="flex-1 justify-center items-start mt-12">
          <Text className="text-white text-2xl font-bold mb-2">
            Premium Groceries{'\n'}Delivered to Your Door
          </Text>
          <Text className="text-white text-base font-semibold">
            Fresh, organic produce and quality{'\n'}products with same-day delivery in Lagos
          </Text>
        </View>

        {/* Buttons */}
        <View className="gap-y-3">
          <TouchableOpacity
            className="py-4 rounded-lg items-center mb-4"
            onPress={() => router.push('/SignupScreen')}
            style={{ backgroundColor: colors.primary }} // Green color
          >
            <Text className="text-white text-base text-lg font-semibold">Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white py-4 rounded-lg items-center"
            onPress={() => router.push('/LoginScreen')}
          >
            <Text className="text-green-600 text-lg text-base font-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Onboarding;
