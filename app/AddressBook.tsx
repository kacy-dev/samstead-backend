import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Address {
  id: string;
  label: string;
  location: string;
}

const AddressBook = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Home',
      location: '1901 Thornridge Cir. Shiloh, Hawaii 81063',
    },
    {
      id: '2',
      label: 'Office',
      location: '4517 Washington Ave. Manchester, Kentucky 39495',
    },
    {
      id: '3',
      label: "Parent's House",
      location: '8502 Preston Rd. Inglewood, Maine 98380',
    },
    {
      id: '4',
      label: "Friend's House",
      location: '2464 Royal Ln. Mesa, New Jersey 45463',
    },
  ]);
  const [selectedAddress, setSelectedAddress] = useState<string>('1');
  const [modalVisible, setModalVisible] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const handleAddAddress = () => {
    if (newLabel.trim() && newLocation.trim()) {
      const newAddress: Address = {
        id: Date.now().toString(),
        label: newLabel,
        location: newLocation,
      };
      setAddresses([...addresses, newAddress]);
      setNewLabel('');
      setNewLocation('');
      setModalVisible(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-5 mt-12">
        <Ionicons name="arrow-back" size={26} color="black" onPress={() => router.back()}/>
        <Text className="ml-3 text-xl font-semibold">Shipping Address</Text>
      </View>

      {/* Address List */}
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        className="px-4"
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedAddress(item.id)}
            className="flex-row items-start py-4 border-b border-gray-100"
          >
            <Ionicons name="location-outline" size={24} color="#7C7C7C" />
            <View className="ml-3 flex-1">
              <Text className="text-lg font-semibold">{item.label}</Text>
              <Text className="text-medium text-gray-500 mt-1">{item.location}</Text>
            </View>
            <View className="w-6 h-6 rounded-full border-2 border-[#7C7C7C] items-center justify-center mt-1">
              {selectedAddress === item.id && (
                <View className="w-3 h-3 rounded-full bg-[#7C7C7C]" />
              )}
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Add Address Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="mx-4 mt-4 border-dashed border border-green-700 py-4 rounded-lg items-center"
      >
        <Text className="text-green-800 font-medium">+ Add New Shipping Address</Text>
      </TouchableOpacity>

      {/* Apply Button */}
      <View className="p-4">
      <TouchableOpacity
        className="bg-green-800 rounded-lg py-4 items-center mb-6"
        onPress={() => {
            const selectedAddressData = addresses.find(addr => addr.id === selectedAddress);
            if (selectedAddressData) {
            router.push({
                pathname: '/Checkout',
                params: {
                label: selectedAddressData.label,
                location: selectedAddressData.location,
                },
            });
            }
        }}
        >
        <Text className="text-white font-semibold text-base">Apply</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for New Address */}
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View className="flex-1 justify-center items-center bg-['#f5f5f5'] bg-opacity-50">
          <View className="bg-white w-[90%] rounded-2xl p-5">
            <Text className="text-lg font-semibold mb-4">New Address</Text>
            <TextInput
              placeholder="Label (e.g. Home, Office)"
              value={newLabel}
              onChangeText={setNewLabel}
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholderTextColor="gray"

            />
            <TextInput
              placeholder="Enter full address"
              value={newLocation}
              onChangeText={setNewLocation}
              className="border border-gray-300 rounded-lg p-3 mb-5"
              multiline
              placeholderTextColor="gray"
            />
            <View className="flex-row justify-end space-x-3">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="px-4 py-2"
              >
                <Text className="text-[#8B5E3C] font-medium">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleAddAddress}
                className="px-4 py-2 bg-[#8B5E3C] rounded-md"
              >
                <Text className="text-white font-medium">Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddressBook;
