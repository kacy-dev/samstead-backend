import { Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import React from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // For icons
import StepIndicator from 'react-native-step-indicator'; // Import the step indicator
import colors from '@/components/colors';
import { router } from 'expo-router';

// Define the type for the StepIndicator props
interface StepIndicatorProps {
  position: number;
  stepStatus: 'current' | 'finished' | 'unfinished';
  label: string;
}

const TrackOrder = () => {
  // Define the steps for the timeline
  const labels = [
    'Order Processing\nOrder confirmed and being prepared\nToday, 10:30 AM',
    'Out for Delivery\nOrder on its way please be patient...\nToday, 10:30 AM',
    'Delivered\nPending delivery confirmation.........',
  ];

  // Define the current step (0-based index)
  const currentStep = 1; // "Out for Delivery" is the current step

  // Custom styles for the step indicator
  const customStyles = {
    stepIndicatorSize: 24,
    currentStepIndicatorSize: 24,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 2,
    stepStrokeWidth: 2,
    stepStrokeCurrentColor: '#34C759', // Green for current step
    stepStrokeFinishedColor: '#34C759', // Green for completed steps
    stepStrokeUnFinishedColor: '#d1d5db', // Gray for unfinished steps
    separatorFinishedColor: '#34C759', // Green for completed separators
    separatorUnFinishedColor: '#d1d5db', // Gray for unfinished separators
    stepIndicatorFinishedColor: '#34C759', // Green for completed steps
    stepIndicatorUnFinishedColor: '#d1d5db', // Gray for unfinished steps
    stepIndicatorCurrentColor: '#34C759', // Green for current step
    stepIndicatorLabelFontSize: 0, // Hide default labels (we'll use custom labels)
    currentStepIndicatorLabelFontSize: 0,
  };

  // Custom icons for each step
  const renderStepIndicator = ({ position, stepStatus }: StepIndicatorProps) => {
    const isFinished = stepStatus === 'finished';
    const isCurrent = stepStatus === 'current';
    const iconName =
      position === 0 ? 'check' : position === 1 ? 'truck-delivery' : 'home';
    const iconColor = isFinished || isCurrent ? '#fff' : '#999';

    return <MaterialCommunityIcons name={iconName} size={16} color={iconColor} />;
  };

  // Custom labels for each step
  const renderLabel = ({
    position,
    stepStatus,
    label,
    currentPosition,
  }: {
    position: number;
    stepStatus: string;
    label: string;
    currentPosition: number;
  }) => {
    const isFinished = position <= currentStep;
    const isCurrent = position === currentStep;
    const [title, description, time] = label.split('\n');
  
    const activeTextColor = isFinished || isCurrent ? 'text-black' : 'text-gray-400';
  
    return (
      <View className="flex-row items-start mt-12">
        {/* Spacer to align with indicator */}
        <View className="w-6" />
  
        <View className="ml-3 mb-6">
          <Text className={`text-lg font-semibold ${activeTextColor}`}>
            {title}
          </Text>
          <Text className={`text-sm font-medium ${activeTextColor}`}>
            {description}
          </Text>
          <Text className={`text-sm font-regular ${activeTextColor}`}>
            {time}
          </Text>
        </View>
      </View>
    );
  };
  

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      

      {/* Timeline */}
      <ScrollView style={{flex: 1}}>
      <View className="flex-row items-center justify-between mt-4 p-4 pt-12">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">Track Order</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Order Info */}
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-semibold text-black">
            Order #SAM2025001
          </Text>
          <Text className="text-sm text-green-600 font-bold">
            In Progress
          </Text>
        </View>
        <Text className="text-gray-500 font-medium mt-1">
          Estimated Delivery: Today, 2:00 PM - 4:00 PM
        </Text>
      </View>
        <View className="p-4" style={{top: -35}}>
          <StepIndicator
            customStyles={customStyles}
            currentPosition={currentStep}
            labels={labels}
            stepCount={3}
            renderStepIndicator={renderStepIndicator}
            renderLabel={renderLabel}
            direction="vertical"
          />
        </View>

        {/* Order Details */}
        <View className="p-4 border-t border-gray-200" style={{top: -55}}>
          <Text className="text-lg font-bold text-black mb-3">
            Order Details
          </Text>
          {/* Item 1 */}
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <View className="w-12 h-12 justify-center items-center">
                <Image source={require('../assets/products/1.png')} className='w-12 h-12' resizeMode='contain'/>
              </View>
              <View className="ml-3">
                <Text className="font-semibold text-black">
                  Fresh Tomatoes
                </Text>
                <Text className="text-sm font-medium text-gray-600">1kg Pack x 2</Text>
              </View>
            </View>
            <Text className="font-bold text-black">₦2,400</Text>
          </View>
          {/* Item 2 */}
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <View className="w-12 h-12 justify-center items-center">
                <Image source={require('../assets/products/1.png')} className='w-12 h-12' resizeMode='contain'/>
              </View>
              <View className="ml-3">
                <Text className="font-semibold text-black">
                  Fresh Tomatoes
                </Text>
                <Text className="text-sm font-medium text-gray-600">1kg Pack x 2</Text>
              </View>
            </View>
            <Text className="font-bold text-black">₦2,400</Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View className="p-4 border-t border-gray-200" style={{top: -50}}>
          <Text className="text-xl font-bold text-black mb-3">
            Delivery Address
          </Text>
          <Text className="text-gray-600 font-medium">
            123 Victoria Island, Lagos
          </Text>
          <Text className="text-gray-600 font-medium">
            Additional Info: Near First Bank
          </Text>
        </View>
        <View className="px-4 pb-5" style={{top: -35}}>
        <TouchableOpacity className="py-4 rounded-lg mb-4 items-center" 
        style={{backgroundColor: colors.primary}}
        onPress={() => router.push('/')}
        >
          <Text className="text-white font-semibold text-base">Contact Delivery Agent</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
      
    </View>
  );
};

export default TrackOrder;