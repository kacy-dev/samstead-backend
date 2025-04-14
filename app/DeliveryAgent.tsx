import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const DeliveryAgent = () => {
  const agent = {
    name: 'Mr Adeagbo Josiah',
    phone: '+234 808 888 6823',
    vehicle: 'Toyota Corolla - Black',
    deliveryId: 'DEL-29839',
    avatar: 'https://i.pravatar.cc/300', // placeholder image
  };

  const handleCall = () => {
    Linking.openURL(`tel:${agent.phone}`);
  };

  const handleMessage = () => {
    Linking.openURL(`sms:${agent.phone}`);
  };

  return (
    <View className="flex-1 p-6" style={{backgroundColor: '#f5f5f5'}}>
      {/* Agent Profile */}
      <View className='bg-white p-4 mt-12 py-4 rounded-lg'>
      <View className="items-center mt-10">
        <Image
          source={{ uri: agent.avatar }}
          className="w-24 h-24 rounded-full mb-4"
        />
        <Text className="text-2xl font-bold text-gray-900">{agent.name}</Text>
        <Text className="text-gray-500">Your Delivery Agent</Text>
      </View>

      {/* Agent Info */}
      <View className="mt-8 space-y-4">
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="phone" size={20} color="#888" />
          <Text className="ml-2 text-gray-800 font-semibold">{agent.phone}</Text>
        </View>
        <View className="flex-row items-center mb-4">
          <Ionicons name="car" size={20} color="#888" />
          <Text className="ml-2 text-gray-800 font-semibold">{agent.vehicle}</Text>
        </View>
        <View className="flex-row items-center">
          <MaterialIcons name="badge" size={20} color="#888" />
          <Text className="ml-2 text-gray-800 font-semibold">Delivery ID: {agent.deliveryId}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="mt-10 flex-row flex-wrap justify-between">
        <TouchableOpacity
          onPress={handleCall}
          className="bg-green-600 px-6 py-3 rounded-lg flex-row items-center"
          style={{width: 150}}
        >
          <Ionicons name="call" size={20} color="#fff" />
          <Text className="text-white font-semibold ml-2">Call Agent</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleMessage}
          className="bg-blue-600 px-6 py-3 rounded-lg flex-row items-center"
          style={{width: 150}}
        >
          <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
          <Text className="text-white font-semibold ml-2">Message</Text>
        </TouchableOpacity>
      </View>
      </View>

      <View className="bg-green-100 p-4 py-6 rounded-lg flex-row border border-green-600 space-x-2 items-start mt-6 mb-2">
        <MaterialCommunityIcons name="truck-delivery" size={18} color="green" />
        <Text className="text-sm text-green-800 flex-1 font-semibold text-green-600 px-6">
          Orders placed before 4 PM will be delivered today. Orders after 4 PM
          will be delivered tomorrow.
        </Text>
      </View>
      <StatusBar style='dark'/>
    </View>
  );
};

export default DeliveryAgent;
