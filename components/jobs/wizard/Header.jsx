import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const TOTAL_STEPS = 4;

export default function Header({ currentStep, totalSteps = 4 }) {
  const router = useRouter();

  return (
    <View className="flex-row items-center px-4 py-4 bg-surface border-b border-border">
      <TouchableOpacity onPress={() => router.back()} className="mr-3">
        <Text className="text-primary text-2xl">←</Text>
      </TouchableOpacity>
      <Text className="text-title font-bold text-lg">New Job</Text>
      <Text className="text-muted text-sm ml-auto">
        Step {currentStep} of {TOTAL_STEPS}
      </Text>
    </View>
  );
}
