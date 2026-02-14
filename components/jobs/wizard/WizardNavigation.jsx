import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

const TOTAL_STEPS = 4;

export default function WizardNavigation({ wizard }) {
  const { currentStep, loading, validateStep, handleNext, handleBack, handleSubmit } = wizard;

  return (
    <View className="px-4 py-4 bg-surface border-t border-border flex-row gap-3">

      {/* Back Button */}
      {currentStep > 1 && (
        <TouchableOpacity
          onPress={handleBack}
          className="px-6 py-4 bg-background border border-border rounded-2xl justify-center items-center"
        >
          <Text className="text-title font-semibold">← Back</Text>
        </TouchableOpacity>
      )}

      {/* Continue or Submit */}
      {currentStep < TOTAL_STEPS ? (
        <TouchableOpacity
          onPress={handleNext}
          disabled={!validateStep(currentStep)}
          className={`flex-1 py-4 rounded-2xl items-center justify-center ${
            validateStep(currentStep) ? "bg-primary" : "bg-border"
          }`}
        >
          <Text
            className={`font-bold text-base ${
              validateStep(currentStep) ? "text-white" : "text-muted"
            }`}
          >
            Continue →
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className="flex-1 py-4 bg-green-500 rounded-2xl items-center justify-center"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-base">✓ Create Job</Text>
          )}
        </TouchableOpacity>
      )}

    </View>
  );
}