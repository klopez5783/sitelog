import { Keyboard, SafeAreaView, TouchableWithoutFeedback, View } from "react-native";

export default function Screen({ children, className = "" }) {
  return (
    <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
    <SafeAreaView className="flex-1 bg-background">
      <View className={`flex-1 ${className}`}>
        {children}
      </View>
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}