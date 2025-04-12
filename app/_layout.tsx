import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import "../global.css";
import { useColorScheme } from '@/components/useColorScheme';
import { useAuthStore } from '@/store/useAuthStore';
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync(); // Keep splash visible until fonts are loaded

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [isAppReady, setIsAppReady] = useState(false);
  const loadAuth = useAuthStore((state) => state.loadAuth);

  useEffect(() => {
    async function prepareApp() {
      try {
        await loadAuth(); // Wait for auth to load
      } catch (e) {
        console.error("Error loading auth:", e);
      } finally {
        setIsAppReady(true); // Mark app ready only after auth and fonts
        SplashScreen.hideAsync();
      }
    }

    if (loaded) {
      prepareApp();
    }
  }, [loaded]);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded || !isAppReady) return null; // Block UI until ready

  return <RootLayoutNav isSplashDone={false} />;
}


function RootLayoutNav({ isSplashDone }: { isSplashDone: boolean }) {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootSiblingParent>
      <Stack initialRouteName={isSplashDone ? "(tabs)" : "Splash"}>
        {/* Splash Screen as initial route */}
        <Stack.Screen name="Splash" options={{ headerShown: false }} />

        {/* Other screens */}
        <Stack.Screen name="Onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="SignupScreen" options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetails" options={{ headerShown: false }} />
        <Stack.Screen name="Cart" options={{ headerShown: false }} />
        <Stack.Screen name="ProductList" options={{ headerShown: false }} />
        <Stack.Screen name="AllProducts" options={{ headerShown: false }} />
        <Stack.Screen name="OtpVerification" options={{ headerShown: false }} />
        <Stack.Screen name="Checkout" options={{ headerShown: false }} />
        <Stack.Screen name="Success" options={{ headerShown: false }} />
        <Stack.Screen name="TrackOrder" options={{ headerShown: false }} />
        <Stack.Screen name="Pricing" options={{ headerShown: false }} />
        <Stack.Screen name="CheckoutScreen" options={{ headerShown: false }} />
        <Stack.Screen name="Settings" options={{ headerShown: false }} />
        <Stack.Screen name="Orders" options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" options={{ headerShown: false }} />
        <Stack.Screen name="Search" options={{ headerShown: false }} />
        <Stack.Screen name="SubscriptionSuccess" options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" options={{ headerShown: false }} />
        <Stack.Screen name="ResetOtpVerification" options={{ headerShown: false }} />
        <Stack.Screen name="Notifications" options={{ headerShown: false }} />
        {/* Tabs group */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <Toast />

      </RootSiblingParent>

    </ThemeProvider>
  );
}
