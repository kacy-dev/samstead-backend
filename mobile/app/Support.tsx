import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
  } from 'react-native'
  import React from 'react'
  import { StatusBar } from 'expo-status-bar'
  import colors from '@/components/colors'
import { router } from 'expo-router'
  
  const Support = () => {
    return (
      <ImageBackground
        source={require('../assets/images/banner1.png')}
        resizeMode='cover'
        className='flex-1'
      >
        {/* Overlay */}
        <ScrollView contentContainerClassName='flex-1 px-4 pt-12' style={{
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.6)', // adjust the last value for darkness
    }}>
          <View className='items-center mb-4 mt-6'>
            <Image
              source={require('../assets/icons/support.png')}
              className='w-20 h-20'
            />
          </View>
          <Text className='text-2xl font-bold text-center text-white mb-6'>
            Contact Support
          </Text>
  
          {/* Contact Cards */}
          <View className='flex-row flex-wrap justify-between mb-6'>
            <TouchableOpacity className='w-[48%] mb-4 bg-green-100 border border-green-600 rounded-lg p-4'>
              <Image
                source={require('../assets/icons/WhatsApp.png')}
                className='w-12 h-12 mb-2'
              />
              <Text className='text-lg font-semibold'>Chat on WhatsApp</Text>
              <Text className='text-gray-400 text-sm'>2 min Estimated reply.</Text>
            </TouchableOpacity>
  
            <TouchableOpacity className='w-[48%] mb-4 bg-blue-100 border border-blue-600 rounded-lg p-4'>
              <Image
                source={require('../assets/icons/Facebook.png')}
                className='w-12 h-12 mb-2'
              />
              <Text className='text-lg font-semibold'>Facebook</Text>
              <Text className='text-gray-400 text-sm'>30 min Estimated reply.</Text>
            </TouchableOpacity>
  
            <TouchableOpacity className='w-[48%] mb-4 bg-red-100 border border-red-600 rounded-lg p-4'>
              <Image
                source={require('../assets/icons/gmail.png')}
                className='w-12 h-12 mb-2'
              />
              <Text className='text-lg font-semibold'>Send Mail</Text>
              <Text className='text-gray-400 text-sm'>Instant Estimated reply.</Text>
            </TouchableOpacity>
  
            <TouchableOpacity className='w-[48%] mb-4 bg-purple-100 border border-purple-600 rounded-lg p-4'>
              <Image
                source={require('../assets/icons/call.png')}
                tintColor={colors.periwinkle}
                className='w-12 h-12 mb-2'
              />
              <Text className='text-lg font-semibold'>Phone Call</Text>
              <Text className='text-gray-400 text-sm'>Instant Estimated reply.</Text>
            </TouchableOpacity>
          </View>
  
          {/* Address Section */}
          <View className='border-t border-gray-300 bg-white rounded-lg pt-4 px-4 p-4'>
            <Text className='text-2xl font-bold mb-1 text-black'>Our Address</Text>
            <Text className='text-lg font-semibold text-black mb-1'>
              Samstead Headquarters
            </Text>
            <Text className='text-black'>123 Groceries Road,</Text>
            <Text className='text-black'>Lagos, Nigeria.</Text>
            <Text className='text-black mt-1'>support@samstead.com</Text>
          </View>
  
          {/* Got It Button */}
          <TouchableOpacity
            className='items-center py-4 rounded-lg mt-6 mb-8'
            style={{ backgroundColor: colors.primary, marginTop: 'auto' }}
            onPress={() => router.push('/(tabs)/account')}
          >
            <Text className='text-white text-lg'>Got It</Text>
          </TouchableOpacity>
  
          <StatusBar style='light' />
        </ScrollView>
      </ImageBackground>
    )
  }
  
  export default Support
  
  const styles = StyleSheet.create({})
  