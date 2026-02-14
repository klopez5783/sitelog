import { View, Text } from "react-native";
import React from "react";

export default function WizardProgressBar({ currentStep, completedSteps = new Set() }) {
  return (
    <View className="px-4 pt-4 pb-2 bg-surface border-b border-border">
      <View className="flex-row gap-2 mb-2">
        {[1, 2, 3, 4].map((step) => (
          <View
            key={step}
            className="flex-1 h-1.5 rounded-full overflow-hidden bg-border"
          >
            <View
              className={`h-full rounded-full ${
                completedSteps.has(step) || currentStep > step
                  ? "bg-green-500"
                  : currentStep === step
                    ? "bg-primary"
                    : "bg-border"
              }`}
              style={{
                width:
                  completedSteps.has(step) || currentStep > step
                    ? "100%"
                    : currentStep === step
                      ? "100%"
                      : "0%",
              }}
            />
          </View>
        ))}
      </View>
      <View className="flex-row justify-between">
        {["Details", "Location", "Dates", "Client"].map((label, i) => (
          <Text
            key={label}
            className={`text-xs font-semibold ${
              currentStep === i + 1 ? "text-primary" : "text-muted"
            }`}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}
