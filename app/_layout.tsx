import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import * as Colors from "@bacons/apple-colors";

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerLargeTitle: true,

          headerTransparent: true,
          headerBlurEffect: "systemChromeMaterial",
          headerShadowVisible: true,
          headerLargeTitleShadowVisible: false,
          headerStyle: {
            // Hack to ensure the collapsed small header shows the shadow / border.
            backgroundColor: "rgba(255,255,255,0.01)",
          },
          // @ts-expect-error
          headerLargeStyle: {
            backgroundColor: Colors.systemGroupedBackground, // Color of your background
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Home" }} />
      </Stack>
    </ThemeProvider>
  );
}
