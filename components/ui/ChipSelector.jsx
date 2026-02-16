import { useRef, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Animated } from "react-native";

function Chip({ label, isSelected, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, speed: 50 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 12 }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={handlePress}
        className={`px-4 py-2 rounded-2xl border mb-2 ${
          isSelected ? "bg-primary border-primary" : "bg-surface border-border"
        }`}
      >
        <Text className={`text-sm font-semibold ${isSelected ? "text-white" : "text-title"}`}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function ChipSelector({
  options = [],
  selected = null,
  onSelect,
  peek = true,
  allowDeselect = true,
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!peek) return;
    const timeout = setTimeout(() => {
      scrollRef.current?.scrollTo({ x: 140, animated: true });
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: 0, animated: true });
      }, 600);
    }, 900);
    return () => clearTimeout(timeout);
  }, []);

  const handleSelect = (id) => {
    if (allowDeselect && selected === id) {
      onSelect(null);
    } else {
      onSelect(id);
    }
  };

  return (
    <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-2 pr-4">
        {options.map((option) => (
          <Chip
            key={String(option.id)}
            label={option.label}
            isSelected={selected === option.id}
            onPress={() => handleSelect(option.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
}