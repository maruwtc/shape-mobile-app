import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from "react-native-paper";

import { useColorScheme } from "@/components/useColorScheme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Manrope-Regular": require("@/assets/fonts/Manrope-Regular.ttf"),
    "Manrope-Bold": require("@/assets/fonts/Manrope-Bold.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const PaperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#153b70",
    accent: "#153b70",
    background: "#f6f6f6",
    surface: "#ffffff",
    error: "#B00020",
    text: "#000000",
    onSurface: "#000000",
    onBackground: "#000000",
    disabled: "#000000",
    placeholder: "#000000",
    backdrop: "#000000",
  },
};

const PaperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#4068a1",
    accent: "#4068a1",
    background: "#121212",
    surface: "#121212",
    error: "#cf6679",
    text: "#ffffff",
    onSurface: "#ffffff",
    onBackground: "#ffffff",
    disabled: "#ffffff",
    placeholder: "#ffffff",
    backdrop: "#ffffff",
  },
};


function RootLayoutNav() {
  const colorScheme = useColorScheme();
  return (
    <PaperProvider theme={colorScheme === "dark" ? PaperDarkTheme : PaperLightTheme}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}