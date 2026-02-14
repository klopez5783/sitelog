import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useJobStore } from "../../store/useJobStore";

export default function DemoBanner() {
  const router = useRouter();
  const { isDemo, exitDemo } = useJobStore();

  if (!isDemo) return null;

  const handleExit = () => {
    exitDemo();
    router.replace("/(auth)/login");
  };

  return (
    <View className="bg-primary px-4 py-2 flex-row items-center justify-between">
      <Text className="text-white text-xs font-semibold">
        DEMO MODE — Sample data only
      </Text>
      <TouchableOpacity onPress={handleExit}>
        <Text className="text-white text-xs underline">Exit Demo</Text>
      </TouchableOpacity>
    </View>
  );
}