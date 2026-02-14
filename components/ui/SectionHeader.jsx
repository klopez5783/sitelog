import { View, Text } from "react-native";

export default function SectionHeader({ title }) {
  return (
    <View className="px-4 py-2">
      <Text className="text-muted text-xs font-semibold uppercase tracking-widest">
        {title}
      </Text>
    </View>
  );
}