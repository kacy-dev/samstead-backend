import { useOrderStore } from '@/store/useOrderStore';
import { useEffect } from 'react';

useEffect(() => {
  // Example dummy data
  const dummyOrder = {
    orderId: 'SAM2025001',
    status: 'In Progress',
    estimatedDelivery: 'Today, 2:00 PM - 4:00 PM',
    items: [
      {
        id: '1',
        name: 'Fresh Tomatoes',
        image: require('../assets/products/1.png'),
        quantity: '1kg Pack x 2',
        price: '₦2,400',
      },
      {
        id: '2',
        name: 'Fresh Tomatoes',
        image: require('../assets/products/1.png'),
        quantity: '1kg Pack x 2',
        price: '₦2,400',
      },
    ],
    deliveryAddress: '123 Victoria Island, Lagos',
    deliveryNote: 'Near First Bank',
    currentStep: 1,
  };

  useOrderStore.getState().setOrder(dummyOrder);
}, []);
