import { View, Text, TextInput } from "react-native";

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  multiline = false,
  numberOfLines = 1,
   returnKeyType = "done",
}) {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-body text-sm font-semibold mb-1 ml-1">
          {label}
        </Text>
      )}
      <TextInput
        className="bg-surface border border-border rounded-2xl px-4 text-title text-base"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
        returnKeyType={multiline ? "default" : returnKeyType}
        style={{
          height: multiline ? undefined : 52,
          minHeight: multiline ? 100 : undefined,
          textAlignVertical: multiline ? "top" : "center",
          paddingTop: multiline ? 14 : 0,
          paddingBottom: multiline ? 14 : 0,
        }}
      />
    </View>
  );
}