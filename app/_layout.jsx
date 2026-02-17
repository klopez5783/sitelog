import { View, ActivityIndicator } from "react-native";
import { Stack, Redirect } from "expo-router";
import { useAuth } from "../lib/useAuth";
import { useJobStore } from "../store/useJobStore";
import "../global.css";
import { SafeAreaProvider  } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

export default function RootLayout() {
  const { loading } = useAuth();
  const { user, isDemo } = useJobStore();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#F5F5F5", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#F97316" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider >
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="job" />
      </Stack>
    </SafeAreaProvider>
  );
}