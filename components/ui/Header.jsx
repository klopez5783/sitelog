import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Header({ title, showBack = false, right = null }) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-4 py-4 bg-surface border-b border-border">
      {/* Left */}
      <View className="w-10">
        {showBack && (
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-primary text-2xl">←</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Title */}
      <Text className="text-title font-bold text-base flex-1 text-center">
        {title}
      </Text>

      {/* Right */}
      <View className="w-10 items-end">
        {right}
      </View>
    </View>
  );
}