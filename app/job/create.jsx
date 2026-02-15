import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useJobWizard } from "../../components/jobs/wizard/useJobWizard";
import Screen from "../../components/ui/Screen";
import StepJobDetails from "../../components/jobs/wizard/StepJobDetails";
import StepLocation from "../../components/jobs/wizard/StepLocation";
import StepDatesAndCrew from "../../components/jobs/wizard/StepDatesAndCrew";
import StepClientInfo from "../../components/jobs/wizard/StepClientInfo";
import WizardProgressBar from "../../components/jobs/wizard/WizardProgressBar";
import WizardNavigation from "../../components/jobs/wizard/WizardNavigation";

const TOTAL_STEPS = 4;

export default function CreateJob() {
  const router = useRouter();
  const wizard = useJobWizard();
  const { currentStep, completedSteps, error } = wizard;

  const renderProgressBar = () => (
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
                  completedSteps.has(step) || currentStep >= step
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

  return (
    <Screen>
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-surface border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Text className="text-primary text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-title font-bold text-lg">New Job</Text>
        <Text className="text-muted text-sm ml-auto">
          Step {currentStep} of {TOTAL_STEPS}
        </Text>
      </View>

      {/* Progress Bar */}
      {renderProgressBar()}

      {/* KeyboardAvoidingView wraps steps AND navigation together */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 80}
      >
        {/* Step Content */}
        <View className="flex-1">
          {currentStep === 1 && <StepJobDetails {...wizard} />}
          {currentStep === 2 && <StepLocation {...wizard} />}
          {currentStep === 3 && <StepDatesAndCrew {...wizard} />}
          {currentStep === 4 && <StepClientInfo {...wizard} />}

          {error ? (
            <Text className="text-danger text-sm px-4 mb-2">{error}</Text>
          ) : null}
        </View>

        {/* Navigation always sits just above the keyboard */}
        <WizardNavigation wizard={wizard} />
      </KeyboardAvoidingView>
    </Screen>
  );
}