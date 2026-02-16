import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAddReport } from "../../../hooks/useAddReport";
import Screen from "../../../components/ui/Screen";
import ReportForm from "../../../components/jobs/report/ReportForm";

export default function AddReport() {
  const { jobId } = useLocalSearchParams();
  const router = useRouter();
  const report = useAddReport(jobId);

  return (
    <Screen>
      <View className="flex-row items-center px-4 py-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <Text className="text-primary text-base font-semibold">← Back</Text>
        </TouchableOpacity>
        <Text className="text-title font-bold text-lg flex-1">Daily Report</Text>
      </View>

      <ReportForm
        form={report.form}
        updateField={report.updateField}
        assignedCrew={report.assignedCrew}
        selectedCrew={report.selectedCrew}
        onToggleCrew={report.toggleCrewMember}
        extraCrew={report.extraCrew}
        onExtraCrewChange={report.setExtraCrew}
        images={report.images}
        onCamera={report.takePhoto}
        onLibrary={report.pickFromLibrary}
        onRemoveImage={report.removeImage}
        submitting={report.submitting}
        error={report.error}
        handleSubmit={report.handleSubmit}
      />
    </Screen>
  );
}