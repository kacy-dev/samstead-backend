import { Image, View } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'

const Splash = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/Onboarding');
    }, 3000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);
  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <Image source={require('../assets/icons/logo.png')} className='w-26 h-20' style={{resizeMode: 'contain'}}/>
    </View>
  )
}

export default Splash