import { View, Text } from "react-native";
import Screen from "../../components/ui/Screen";
import Header from "../../components/jobs/wizard/Header";
import WizardProgressBar from "../../components/jobs/wizard/WizardProgressBar";
import StepJobDetails from "../../components/jobs/wizard/StepJobDetails";
import StepLocation from "../../components/jobs/wizard/StepLocation";
import StepDatesAndCrew from "../../components/jobs/wizard/StepDatesAndCrew";
import StepClientInfo from "../../components/jobs/wizard/StepClientInfo";
import WizardNavigation from "../../components/jobs/wizard/WizardNavigation";
import { useJobWizard } from "../../components/jobs/wizard/useJobWizard";

export default function CreateJob() {
  const wizard = useJobWizard();

  return (
    <Screen>
      <Header />
      <WizardProgressBar currentStep={wizard.currentStep} />
      {wizard.currentStep === 1 && <StepJobDetails {...wizard} />}
      {wizard.currentStep === 2 && <StepLocation {...wizard} />}
      {wizard.currentStep === 3 && <StepDatesAndCrew {...wizard} />}
      {wizard.currentStep === 4 && <StepClientInfo {...wizard} />}
      <WizardNavigation wizard={wizard} />
    </Screen>
  );
}
