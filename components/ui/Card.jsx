import { View } from "react-native";

export default function Card({ children, className = "" }) {
  return (
    <View
      className={`bg-surface rounded-2xl p-4 mb-3 ${className}`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {children}
    </View>
  );
}