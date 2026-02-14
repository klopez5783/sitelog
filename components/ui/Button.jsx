import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

export default function Button({
  label,
  onPress,
  loading = false,
  variant = "primary",
  className = "",
}) {
  const base = "w-full rounded-2xl py-4 items-center justify-center";

  const variants = {
    primary: "bg-primary",
    outline: "border border-border bg-surface",
    ghost: "bg-transparent",
    danger: "bg-danger",
  };

  const textVariants = {
    primary: "text-white font-bold text-base",
    outline: "text-title font-semibold text-base",
    ghost: "text-primary font-semibold text-base",
    danger: "text-white font-bold text-base",
  };

  return (
    <TouchableOpacity
      className={`${base} ${variants[variant]} ${className}`}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : "#F97316"} />
      ) : (
        <Text className={textVariants[variant]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}