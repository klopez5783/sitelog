import { Stack } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import "../../global.css";

export default function RootLayout() {
  useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="job" />
    </Stack>
  );
}