import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "../../lib/auth";
import { useJobStore } from "../../store/useJobStore";
import Screen from "../../components/ui/Screen";

export default function Settings() {
  const router = useRouter();
  const { user } = useJobStore();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <Screen>
      <View className="px-4 py-4 border-b border-border">
        <Text className="text-title font-bold text-2xl">Settings</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        {/* Account Section */}
        <Text className="text-muted text-xs font-semibold uppercase tracking-widest mb-2">
          Account
        </Text>
        <View className="bg-surface border border-border rounded-2xl mb-4">
          <View className="px-4 py-3 border-b border-border">
            <Text className="text-muted text-xs mb-1">Name</Text>
            <Text className="text-title text-sm">{user?.name || "—"}</Text>
          </View>
          <View className="px-4 py-3">
            <Text className="text-muted text-xs mb-1">Email</Text>
            <Text className="text-title text-sm">{user?.email || "—"}</Text>
          </View>
        </View>

        {/* App Section */}
        <Text className="text-muted text-xs font-semibold uppercase tracking-widest mb-2 mt-4">
          App
        </Text>
        <View className="bg-surface border border-border rounded-2xl mb-4">
          <View className="px-4 py-3">
            <Text className="text-muted text-xs mb-1">Version</Text>
            <Text className="text-title text-sm">1.0.0</Text>
          </View>
        </View>

        {/* Legal Section */}
        <Text className="text-muted text-xs font-semibold uppercase tracking-widest mb-2 mt-4">
          Legal
        </Text>
        <View className="bg-surface border border-border rounded-2xl mb-4">
          <TouchableOpacity className="px-4 py-3 border-b border-border">
            <Text className="text-title text-sm">Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-4 py-3">
            <Text className="text-title text-sm">Terms of Service</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 rounded-2xl py-4 items-center mb-8"
        >
          <Text className="text-white font-bold text-base">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}