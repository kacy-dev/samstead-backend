import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useProductStore } from "@/store/useProductStore";
import { router } from "expo-router";
import Header from "@/components/Header";
import Toast from "react-native-root-toast";
import { api } from "@/api";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function TabOneScreen() {
  const [search, setSearch] = useState("");
  const [dailDeals, setDailDeals] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);

  interface UserProfile {
    name: string;
    email: string;
    phoneNumber: string;
    deliveryAddress?: string;
    country?: string;
    profilePicture?: string;
  }

    useEffect(() => {
      fetchUserDetails();
    }, []);
  

  const fetchDailyDeals = async () => {
    try {
      const response = await fetch(api("categories/daily-deals"), {
        method: "GET",
      });

      const data = await response.json();

      console.log(data);
      setDailDeals(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  
  
  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem("user_id");
  
      if (!userId) {
        console.log("User ID not found. Redirecting to login.");
        router.replace("/LoginScreen"); // 👈 redirect to login
        return;
      }
  
      const response = await fetch(api(`user/fetch-user/${userId}`), {
        method: "GET",
      });
  
      const data = await response.json();
      console.log(data);
  
      if (!data?.data) {
        console.log("Invalid user data. Redirecting to login.");
        await AsyncStorage.removeItem("user_id"); // clean up
        router.replace("/LoginScreen");
        return;
      }
  
      setUser(data.data);
    } catch (error) {
      console.log("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchRecommendedProducts = async () => {
    try {
      const response = await fetch(api("categories/recommend-products"), {
        method: "GET",
      });

      const data = await response.json();

      console.log(data);
      setRecommendedProducts(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDailyDeals();
    fetchRecommendedProducts();
  }, []);

  if (loading) return <ActivityIndicator />;


  // mock/products.ts
  const dailyDeals = [
    {
      name: "Fresh Tomatoes",
      price: "1200",
      oldPrice: "1500",
      weight: "1000",
      image: require("@/assets/products/1.png"),
      description:
        "Premium organic tomatoes sourced directly from local Nigerian farms. These vine-ripened tomatoes are carefully selected for their superior taste and quality. Perfect for salads, cooking, or making fresh sauce.",
      calories: "22 Kcal/100g",
      protein: "1.1g",
      carbohydrates: "10g",
      vitaminC: "100mg",
    },
    {
      name: "Bell Peppers",
      price: "900",
      oldPrice: "2500",
      weight: "500",
      image: require("@/assets/products/2.png"),
      description:
        "Premium organic tomatoes sourced directly from local Nigerian farms. These vine-ripened tomatoes are carefully selected for their superior taste and quality. Perfect for salads, cooking, or making fresh sauce.",
      calories: "22 Kcal/100g",
      protein: "1.1g",
      carbohydrates: "10g",
      vitaminC: "100mg",
    },
    {
      name: "Potatoes",
      price: "6700",
      oldPrice: "7000",
      weight: "500",
      image: require("@/assets/products/3.png"),
      description:
        "Premium organic tomatoes sourced directly from local Nigerian farms. These vine-ripened tomatoes are carefully selected for their superior taste and quality. Perfect for salads, cooking, or making fresh sauce.",
      calories: "22 Kcal/100g",
      protein: "1.1g",
      carbohydrates: "10g",
      vitaminC: "100mg",
    },
  ];

  const RecommendedProducts = [
    {
      name: "Sweet Potatoes",
      price: "1600",
      weight: "500",
      image: require("@/assets/products/4.png"),
      description:
        "Premium organic tomatoes sourced directly from local Nigerian farms. These vine-ripened tomatoes are carefully selected for their superior taste and quality. Perfect for salads, cooking, or making fresh sauce.",
      calories: "22 Kcal/100g",
      protein: "1.1g",
      carbohydrates: "10g",
      vitaminC: "100mg",
    },
    {
      name: "Irish Potatoes",
      price: "3000",
      weight: "500",
      image: require("@/assets/products/5.png"),
      description:
        "Premium organic tomatoes sourced directly from local Nigerian farms. These vine-ripened tomatoes are carefully selected for their superior taste and quality. Perfect for salads, cooking, or making fresh sauce.",
      calories: "22 Kcal/100g",
      protein: "1.1g",
      carbohydrates: "10g",
      vitaminC: "100mg",
    },
  ];

  return (
    <View className="flex-1 bg-['#f8f8f8'] px-4 py-2">
      {/* Header */}

      <Header />
      <View className="flex-row items-center mb-4 mt-2">
        <Ionicons name="location" size={20} color={"green"} />
        <Text
          className="text-black-600 font-semibold text-lg"
          style={{ fontSize: 16 }}
          numberOfLines={1}
        >
          Deliver to:{" "}
          <Text className="font-bold text-black" numberOfLines={1}>
          {user?.deliveryAddress}
          </Text>
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Delivery Location */}

        {/* Categories Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-2"
        >
          {["All", "Vegetables", "Fruits", "Meat"].map((category, index) => (
            <TouchableOpacity
              key={index}
              className="bg-green-100 rounded-full mx-1 mb-12 px-6 py-2 items-center justify-center min-h-[36px]"
              onPress={() =>
                router.push({ pathname: "/ProductList", params: { category } })
              }
            >
              <Text className="font-bold text-sm" style={{ color: "#058044" }}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Premium Membership Banner */}
        <View
          className="p-4 rounded-2xl mb-4 mt-[-20px]"
          style={{ backgroundColor: "#058044" }}
        >
          <Text className="text-white font-bold text-2xl mb-1">
            Premium Membership
          </Text>
          <Text className="text-white text-lg mb-4">
            Get exclusive deals and priority delivery
          </Text>
          <TouchableOpacity
            className="mt-2 bg-white py-4 px-4 rounded-lg w-36"
            onPress={() => router.push("/Pricing")}
          >
            <Text
              className="font-semibold text-center"
              style={{ color: "#058044" }}
            >
              Upgrade Now
            </Text>
          </TouchableOpacity>
        </View>

        {/* Today's Deals */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold mt-4">Today's Deals</Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/AllProducts",
                params: { category: "Deals" },
              })
            }
          >
            <Text className="text-green-600 font-semibold text-lg mt-4">
              See All Products
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4 min-h-[220px]"
        >
          {dailyDeals.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                useProductStore.getState().setSelectedProduct({
                  ...item,
                  totalPrice: parseFloat(item.price).toFixed(2),
                });
                router.push("/ProductDetails");
              }}
              key={index}
              className="bg-white p-4 rounded-lg mx-2 min-w-[170px]"
            >
              <Image
                source={item.image}
                className="w-full h-20 rounded-lg mb-3 mt-2"
                resizeMode="contain"
              />
              <Text className="font-bold text-lg mt-2">{item.name}</Text>
              <Text className="text-gray-500 text-lg font-semibold">
                {item.weight}g Pack
              </Text>

              <View className="flex-row justify-between items-center mt-4">
                <View>
                  <Text
                    className="text-lg font-bold"
                    style={{ color: "#058044" }}
                  >
                    ₦{parseFloat(item.price).toFixed(2)}
                  </Text>
                  {item.oldPrice && (
                    <Text className="text-gray-500 line-through">
                      ₦{parseFloat(item.oldPrice).toFixed(2)}{" "}
                      {/* Convert to number */}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  className="p-2 rounded-lg w-10 h-12 justify-center items-center"
                  style={{ backgroundColor: "#058044" }}
                  onPress={() => {
                    useProductStore.getState().addToCart({
                      ...item,
                      quantity: 1,
                      totalPrice: parseFloat(item.price).toFixed(2),
                    });
                    Toast.show(`${item.name} added to cart`, {
                      duration: Toast.durations.SHORT,
                      position: Toast.positions.BOTTOM,
                    });
                  }}
                >
                  <FontAwesome name="plus" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Popular Categories */}
        <Text className="text-lg font-bold mb-2">Popular Categories</Text>
        <View className="flex-row justify-between mb-4">
          {["Vegetables", "Fruits", "Dairy", "Meat"].map((category, index) => (
            <TouchableOpacity
              key={index}
              className="items-center justify-center min-h-[100px]"
              onPress={() =>
                router.push({ pathname: "/ProductList", params: { category } })
              }
            >
              <View className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <FontAwesome name="leaf" size={24} color="#058044" />
              </View>
              <Text className="text-gray-500 text-sm font-semibold">
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recommended for You */}
        <Text className="text-lg font-bold mb-4 mt-4">Recommended for You</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4 min-h-[220px]"
        >
          {RecommendedProducts.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                useProductStore.getState().setSelectedProduct({
                  ...item,
                  totalPrice: parseFloat(item.price).toFixed(2),
                });
                router.push("/ProductDetails");
              }}
              key={index}
              className="bg-white p-4 rounded-lg mx-2 min-w-[170px]"
            >
              <Image
                source={item.image}
                className="w-full h-20 rounded-lg mb-3 mt-2"
                resizeMode="contain"
              />
              <Text className="font-bold text-lg mt-2">{item.name}</Text>
              <Text className="text-gray-500 text-lg font-semibold">
                {item.weight}g Pack
              </Text>

              <View className="flex-row justify-between items-center mt-4">
                <Text
                  className="text-lg font-bold"
                  style={{ color: "#058044" }}
                >
                  ₦{parseFloat(item.price).toFixed(2)} {/* Convert to number */}
                </Text>

                <TouchableOpacity
                  className="p-2 rounded-lg w-10 h-12 justify-center items-center"
                  style={{ backgroundColor: "#058044" }}
                  onPress={() => {
                    useProductStore.getState().addToCart({
                      ...item,
                      totalPrice: parseFloat(item.price).toFixed(2),
                    });
                    Toast.show(`${item.name} added to cart`, {
                      duration: Toast.durations.SHORT,
                      position: Toast.positions.BOTTOM,
                    });
                  }}
                >
                  <FontAwesome name="plus" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <StatusBar style="dark" backgroundColor="white" />
      </ScrollView>
    </View>
  );
}
