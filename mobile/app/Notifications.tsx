import { Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: any;
};

const notifications: Notification[] = [
  {
    id: '1',
    title: "Thursday’s Feast Awaits!",
    description: "Your Exotic Veggie Platter is on the menu. Get excited!",
    time: "2 days ago",
    icon: require('../assets/icons/7.png'),
  },
  {
    id: '2',
    title: "Meal Kit En Route!",
    description: "Today’s the day. Your culinary adventure is almost there.",
    time: "6 days ago",
    icon: require('../assets/icons/2.png'),
  },
  {
    id: '3',
    title: "Tomorrow’s Treats!",
    description: "Last chance to add a little extra to your Tuesday delivery.",
    time: "9 days ago",
    icon: require('../assets/icons/3.png'),
  },
  {
    id: '4',
    title: "Order Tweaked!",
    description: "Added Gourmet Cheese to your kit. Next week just got tastier!",
    time: "13 days ago",
    icon: require('../assets/icons/4.png'),
  },
  {
    id: '5',
    title: "Fresh Flavors Unveiled!",
    description: "New menu items are in! What will you try next?",
    time: "4 days ago",
    icon: require('../assets/icons/5.png'),
  },
  {
    id: '6',
    title: "Taste Satisfaction?",
    description: "Tell us how the Veggie Platter did on the flavor front!",
    time: "1 week ago",
    icon: require('../assets/icons/6.png'),
  },
  {
    id: '7',
    title: "Weekend Bonus!",
    description: "Get 10% off on a surprise side for your next order. Yum!",
    time: "11 days ago",
    icon: require('../assets/icons/7.png'),
  },
  {
    id: '8',
    title: "Delivery Day!",
    description: "Your meal kit, now with extra flavor!",
    time: "2 weeks ago",
    icon: require('../assets/icons/1.png'),
  },
];

const Notifications = () => {
  const hasNotifications = notifications.length > 0;

  return (
    <View className="flex-1 bg-white pt-14 px-5">
        <View className='flex-row items-center justify-between mb-8'>
            <TouchableOpacity onPress={() => router.back()}>
                <AntDesign name='left' size={20}/>
            </TouchableOpacity>
            <Text className="text-center font-bold text-2xl">Notifications</Text>
            <Text className="text-center font-bold text-lg"></Text>
        </View>

      {hasNotifications ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="flex-row items-start py-4 border-b border-gray-200 mb-6">
              <Image source={item.icon} className="w-10 h-10 mt-1 mr-3" resizeMode='contain' />
              <View className="flex-1">
                <Text className="font-bold text-lg">{item.title}</Text>
                <Text className="text-gray-600">{item.description}</Text>
              </View>
              <Text className="text-gray-400 font-semibold text-xs mt-1">{item.time}</Text>
            </View>
          )}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Image
            source={require('../assets/icons/notification.png')}
            className="w-14 h-14 opacity-50 mb-4"
          />
          <Text className="text-gray-600 font-semibold text-base mb-1">No Notifications</Text>
          <Text className="text-center text-gray-400 text-sm px-10">
            We’ll let you know when there will be something to update you.
          </Text>
        </View>
      )}
    </View>
  );
};

export default Notifications;
