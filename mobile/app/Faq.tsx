import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

type Category = 'Delivery' | 'Subscription' | 'Payments';

type FaqItem = {
    question: string;
    answer: string;
  };
  
  const faqData: Record<Category, FaqItem[]> = {
  Delivery: [
    {
      question: 'How long does delivery take?',
      answer: 'Delivery usually takes 3-5 business days depending on your location.',
    },
    {
      question: 'Can I track my delivery?',
      answer: 'Yes, tracking information will be sent to your email after shipping.',
    },
  ],
  Subscription: [
    {
      question: 'How to manage my subscription?',
      answer: 'Go to settings > Subscription to manage your plans.',
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription anytime with no additional fee.',
    },
  ],
  Payments: [
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept credit/debit cards, PayPal, and other major wallets.',
    },
    {
      question: 'How to get a refund?',
      answer: 'Contact support within 7 days of your purchase to request a refund.',
    },
  ],
};



const Faq = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<Category>('Delivery');


  const handleToggle = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };
  const colors: Record<Category, { bg: string; text: string; border: string }> = {
    Delivery: { bg: 'bg-blue-100', border: 'border-blue-600', text: 'text-blue-600' },
    Subscription: { bg: 'bg-green-100', border: 'border-green-700', text: 'text-green-700' },
    Payments: { bg: 'bg-red-100', border: 'border-red-600', text: 'text-red-600' },
  };
  
  

  return (
    <View className="flex-1 bg-white pt-14 px-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity onPress={() => router.push('/(tabs)/account')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">FAQ</Text>
        <TouchableOpacity>
          <Feather name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text className="text-2xl font-bold text-center mb-4">How can we help you?</Text>

      {/* Search Bar */}
      <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-4 mb-6">
        <Feather name="search" size={18} color="#999" />
        <TextInput
          placeholder="Enter your keyword"
          placeholderTextColor="#999"
          className="ml-2 flex-1 text-base"
        />
      </View>

      {/* Category Buttons */}
      <View className="flex-row justify-between mb-6">
      {(Object.keys(colors) as Category[]).map((category) => (
        <TouchableOpacity
            key={category}
            onPress={() => {
            setSelectedCategory(category);
            setExpandedIndex(null);
            }}
            className={`px-3 py-4 rounded-lg w-[32%] border ${
                selectedCategory === category ? colors[category].border : 'border-transparent'
              } ${colors[category].bg}`}
        >
            <Text className={`font-semibold text-xs mb-1 ${colors[category].text}`}>
            Questions about
            </Text>
            <Text className="text-black font-bold text-xsm">{category}</Text>
        </TouchableOpacity>
        ))}


      </View>

      {/* Top Questions */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold">Top Questions</Text>
      </View>

      {/* Questions List */}
      <ScrollView showsVerticalScrollIndicator={false}>
  {faqData[selectedCategory].map((item: FaqItem, index: number) => (
    <TouchableOpacity
      key={index}
      onPress={() => handleToggle(index)}
      className={`rounded-xl px-4 py-4 mb-3 border ${colors[selectedCategory].border} ${colors[selectedCategory].bg}`}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold">{item.question}</Text>
        <MaterialCommunityIcons
          name={expandedIndex === index ? 'minus' : 'plus'}
          size={18}
          color="black"
        />
      </View>
      {expandedIndex === index && (
        <Text className="text-sm text-gray-600 leading-5">{item.answer}</Text>
      )}
    </TouchableOpacity>
  ))}
</ScrollView>

    </View>
  );
};

export default Faq;
