import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView  } from "react-native-safe-area-context";

export default function Screen({ children, className = "" }) {
  return (
    <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
    <SafeAreaView  className="flex-1 bg-background">
      <View className={`flex-1 ${className}`}>
        {children}
      </View>
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}