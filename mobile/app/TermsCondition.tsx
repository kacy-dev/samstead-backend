import colors from '@/components/colors';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';


const TermsCondition = () => {
    const scrollRef = useRef<ScrollView>(null);
  
    const handleScrollToTop = () => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    };

  return (
    <View className="flex-1 bg-white px-4 pt-10">
        <TouchableOpacity className='flex-row items-center gap-2 mt-6 mb-6' onPress={() => router.push('/(tabs)/account')}>
            <AntDesign name='left' size={18}/>
            <Text className='font-bold text-lg'>Back</Text>
        </TouchableOpacity>
      {/* Header */}
      <View className='pt-2 mb-4' style={{borderBottomWidth: 1, borderColor: '#ddd'}}>
        <Text className="text-2xl text-gray-400 tracking-widest uppercase mb-1">AGREEMENT</Text>
        <Text className="text-2xl font-bold text-gray-900 mb-1">Terms of Service</Text>
        <Text className="text-sm text-gray-400 mb-4">Last updated on 5/12/2025

        </Text>
      </View>

      {/* Content */}
      <ScrollView
       ref={scrollRef}
       className="flex-1"
       contentContainerStyle={{ paddingBottom: 10 }}
       showsVerticalScrollIndicator={true}
      >
        <Text className="text-lg font-bold text-gray-900 mb-2">Clause 1</Text>
        <Text className="text-xsm text-gray-700 mb-4 leading-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. 
          Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper 
          suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.
        </Text>

        <Text className="text-lg font-bold text-gray-900 mb-2">Clause 2</Text>
        <Text className="text-xsm text-gray-700 mb-4 leading-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. 
          Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper 
          suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.
        </Text>

        <Text className="text-xsm text-gray-700 mb-4 leading-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. 
          Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper 
          suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.
        </Text>

        <Text className="text-lg font-bold text-gray-900 mb-2">Clause 2</Text>
        <Text className="text-xsm text-gray-700 mb-4 leading-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. 
          Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper 
          suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.
        </Text>

        <Text className="text-xsm text-gray-700 mb-4 leading-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. 
          Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper 
          suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.
        </Text>

        <Text className="text-lg font-bold text-gray-900 mb-2">Clause 2</Text>
        <Text className="text-xsm text-gray-700 mb-4 leading-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. 
          Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper 
          suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.
        </Text>

        <Text className="text-xsm text-gray-700 mb-4 leading-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. 
          Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper 
          suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.
        </Text>

        <Text className="text-lg font-bold text-gray-900 mb-2">Clause 2</Text>
        <Text className="text-xsm text-gray-700 mb-4 leading-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. 
          Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper 
          suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.
        </Text>

        <Text className="text-xsm text-gray-700 mb-4 leading-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. 
          Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper 
          suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.
        </Text>

        <Text className="text-lg font-bold text-gray-900 mb-2">Clause 2</Text>
        <Text className="text-xsm text-gray-700 mb-4 leading-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. 
          Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper 
          suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.
        </Text>

        <Text className="text-xsm text-gray-700 mb-4 leading-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. 
          Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper 
          suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.
        </Text>

        <Text className="text-lg font-bold text-gray-900 mb-2">Clause 2</Text>
        <Text className="text-xsm text-gray-700 mb-4 leading-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. 
          Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper 
          suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.
        </Text>

        <Text className="text-xsm text-gray-700 mb-4 leading-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. 
          Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper 
          suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.
        </Text>

        <Text className="text-lg font-bold text-gray-900 mb-2">Clause 2</Text>
        <Text className="text-xsm text-gray-700 mb-4 leading-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. 
          Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper 
          suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.
        </Text>

        <Text className="text-xsm text-gray-700 mb-4 leading-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. 
          Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper 
          suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.
        </Text>
      </ScrollView>

      {/* Scroll to bottom button */}
      <TouchableOpacity
        onPress={handleScrollToTop}
        style={{ transform: [{ translateX: -75 }], backgroundColor: colors.primary, marginBottom: 30, padding: 10, alignSelf: 'center' }} // Optional tweak for centering
        className='rounded-full w-36 items-center mt-4'
      >
        <Text className="text-white text-sm">Scroll to Top</Text>
      </TouchableOpacity>
      <StatusBar style='dark'/>
    </View>
  );
};

export default TermsCondition;
