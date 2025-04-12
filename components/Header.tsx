import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { useProductStore } from '@/store/useProductStore';
import { push } from 'expo-router/build/global-state/routing';

const Header = () => {
  const cart = useProductStore((state) => state.cart);
  const navigation = useNavigation();

  return (
    <View className="flex-row items-center justify-between mb-2 mt-12">
      <Image
        source={require('@/assets/icons/logo.png')}
        className="w-36 h-16 rounded-full"
        resizeMode="contain"
      />
      <View className="flex-row items-center justify-end  gap-4">
        <TouchableOpacity onPress={() => router.push('/Search')}>
        <AntDesign name="search1" size={30} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/Cart')}
          style={styles.cartIconContainer}
        >
          <Ionicons name="cart-outline" size={28} color="black" />
          {cart.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Header;
