import { View, Text, TextInput, Platform } from "react-native";

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  multiline = false,
  returnKeyType = "done",
  onSubmitEditing,
  onFocus,
  maxLength
}) {
  return (
    <View className="mb-4">
      {label ? (
        <Text className="text-body text-sm font-semibold mb-1 ml-1">
          {label}
        </Text>
      ) : null}
      <TextInput
        className="bg-surface border justify-center-safe border-border rounded-2xl px-4 text-title text-base"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        returnKeyType={multiline ? "default" : returnKeyType}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={!multiline}
        onFocus={onFocus}
        maxLength={maxLength}
        style={{
          height: multiline ? undefined : 50,
          minHeight: multiline ? 100 : undefined,
          textAlignVertical: multiline ? "top" : "center",
          includeFontPadding: false,
          lineHeight: 18,
        }}
      />
    </View>
  );
}
