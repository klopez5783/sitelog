import { View, Text } from "react-native";

export default function EmptyState({ emoji, title, subtitle }) {
  return (
    <View className="items-center mt-16">
      <Text className="text-4xl mb-3">{emoji}</Text>
      <Text className="text-title font-semibold text-base">{title}</Text>
      <Text className="text-muted text-sm mt-1 text-center px-6">{subtitle}</Text>
    </View>
  );
}