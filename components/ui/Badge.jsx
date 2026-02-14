import { View, Text } from "react-native";

const variants = {
  active: { bg: "bg-orange-100", text: "text-orange-600" },
  completed: { bg: "bg-green-100", text: "text-green-600" },
  pending: { bg: "bg-yellow-100", text: "text-yellow-600" },
  danger: { bg: "bg-red-100", text: "text-red-600" },
};

export default function Badge({ label, variant = "active" }) {
  const style = variants[variant] || variants.active;

  return (
    <View className={`px-3 py-1 rounded-full ${style.bg}`}>
      <Text className={`text-xs font-semibold ${style.text}`}>{label}</Text>
    </View>
  );
}