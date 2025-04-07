import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { Ionicons, Feather, Entypo, FontAwesome6, AntDesign, MaterialIcons } from '@expo/vector-icons';
import colors from '@/components/colors';
import { router } from 'expo-router';

const Account = () => {
  
  return (
    <ScrollView className='flex-1 p-4' style={{backgroundColor: '#f6f6f6'}}>
      {/* Header */}
      <View className='flex-row items-center justify-between mb-4 mt-12'>
        <View className='flex-row items-center gap-2'>
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text className='text-2xl font-bold'>My Account</Text>
        </View>
        <Ionicons name="settings" size={30} color="#333" />
      </View>

      {/* Profile */}
      <View className='flex-row items-center mt-4 gap-4'>
        <Image source={{ uri: 'https://i.pravatar.cc/100' }} className='w-20 h-20 rounded-full' />
        <View>
          <Text className='text-lg font-bold'>Sarah Johnson</Text>
          <Text className='font-semibold text-sm text-gray-500'>+234 801 234 5678</Text>
          <View className='bg-green-100 items-center rounded-full' style={{padding: 1, width: 88}}>
            <Text className='text-green-600 text-sm font-semibold'>Elite Member</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity className='rounded-lg p-3 mt-4 items-center' style={{backgroundColor: colors.primary}}>
        <Text className='text-lg text-white font-semibold'>Edit Profile</Text>
      </TouchableOpacity>

      {/* Membership Details */}
      <View className='mt-8 bg-white p-4 rounded-lg'>
        <Text className='text-black text-lg font-bold mb-4'>Membership Details</Text>
        <View className='flex-row items-center justify-between'>
          <View className='flex-row items-center'>
            <View className='bg-green-100 p-2 rounded-lg'>
              <FontAwesome6 name="crown" size={20} color="#10b981" />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text className='font-bold'>Elite Membership</Text>
              <Text className='font-regular text-gray-500 text-sm'>Valid until Dec 31, 2025</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Text className='text-green-600 font-bold'>Renew</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Orders */}
      <View className='mt-6 bg-white rounded-lg'>
        {/* Order Card */}
        <View className='p-4 rounded-lg '>
          <Text className='font-bold text-lg mb-4'>Recent Orders</Text>
          <View className='p-2 rounded-lg' style={{borderWidth: 1, borderColor: '#ddd'}}>
            <View className='flex-row justify-between items-center'>
              <Text className='font-bold '>#ORD123456</Text>
              <View className='bg-green-100 px-2 rounded-full' style={{padding: 2}}>
                <Text className='text-sm font-semibold text-green-600'>Delivered</Text>
              </View>
            </View>
          
          <Text className='text-sm font-semibold text-gray-500'>Oct 15, 2025</Text>
          <View className='flex-row items-center justify-between mt-4'>
            <Text className='font-semibold text-gray-500'>12 items</Text>
            <Text className='font-bold'>₦25,400</Text>
          </View>
          </View>
        </View>

        <View className='p-4 rounded-lg bg-white'>
          <View className='p-2 rounded-lg' style={{borderWidth: 1, borderColor: '#ddd'}}>
            <View className='flex-row justify-between items-center'>
              <Text className='font-bold '>#ORD123456</Text>
              <View className='bg-green-100 px-2 rounded-full' style={{padding: 2}}>
                <Text className='text-sm font-semibold text-green-600'>Delivered</Text>
              </View>
            </View>
          
          <Text className='text-sm font-semibold text-gray-500'>Oct 12, 2025</Text>
          <View className='flex-row items-center justify-between mt-4'>
            <Text className='font-semibold text-gray-500'>8 items</Text>
            <Text className='font-bold'>₦18,900</Text>
          </View>
          </View>
          <TouchableOpacity className='items-center mt-4'>
            <Text className='font-bold text-green-600'>View All Orders</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Support */}
      <View className='bg-white mt-4 rounded-lg p-4 mb-4'>
        <Text className='text-lg font-bold mb-4'>Support</Text>
        <TouchableOpacity className='flex-row justify-between items-center mb-8'>
          <View className='flex-row items-center gap-4'>
            <MaterialIcons name="support-agent" size={20} color="#4B5563" />
            <Text className='font-bold'>Contact Support</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={18} color="#4B5563" />
        </TouchableOpacity>
        <TouchableOpacity className='flex-row justify-between items-center mb-8'>
          <View className='flex-row items-center gap-4'>
            <AntDesign name="questioncircle" size={20} color="#4B5563" />
            <Text className='font-bold'>FAQs</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={18} color="#4B5563" />
        </TouchableOpacity>
        <TouchableOpacity className='flex-row justify-between items-center mb-8'>
          <View className='flex-row items-center gap-4'>
            <MaterialIcons name="my-library-books" size={20} color="#4B5563" />
            <Text className='font-bold'>Terms & Conditions</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={18} color="#4B5563" />
        </TouchableOpacity>
        <TouchableOpacity className='flex-row justify-between items-center mb-2' onPress={() => router.replace('/Onboarding')}>
          <View className='flex-row items-center gap-4'>
            <MaterialIcons name="lock" size={20} color="red" />
            <Text className='font-bold' style={{color: 'red'}}>Log Out</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={18} color="#4B5563" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Account;
