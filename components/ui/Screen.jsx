import { SafeAreaView, View } from "react-native";

export default function Screen({ children, className = "" }) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className={`flex-1 ${className}`}>
        {children}
      </View>
    </SafeAreaView>
  );
}