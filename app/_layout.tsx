import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import "../global.css";
import { useColorScheme } from '@/components/useColorScheme';

SplashScreen.preventAutoHideAsync(); // Keep splash visible until fonts are loaded

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [isSplashDone, setIsSplashDone] = useState(false); // Track if splash is finished

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync(); // Hide splash screen when fonts are loaded
      setIsSplashDone(true); // Mark splash as done
    }
  }, [loaded]);

  if (!loaded) return null; // Don't render anything until fonts are loaded

  return <RootLayoutNav isSplashDone={isSplashDone} />;
}

function RootLayoutNav({ isSplashDone }: { isSplashDone: boolean }) {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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

        {/* Tabs group */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
