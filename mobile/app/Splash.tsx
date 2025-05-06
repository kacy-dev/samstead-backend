import { Image, View } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useAuthStore } from "@/store/useAuthStore";

const Splash = () => {
  const router = useRouter();

  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoggedIn) {
        router.replace("/(tabs)");
      } else {
        router.replace("/LoginScreen");
      }
    }, 1500); // Simulate splash delay

    return () => clearTimeout(timeout);
  }, [isLoggedIn]);
  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <Image source={require('../assets/icons/logo.png')} className='w-26 h-20' style={{resizeMode: 'contain'}}/>
    </View>
  )
}

export default Splash