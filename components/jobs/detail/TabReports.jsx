import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Card from "../../ui/Card";
import EmptyState from "./EmptyState";

export default function TabReports({ reports, jobId }) {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
      <TouchableOpacity
        className="bg-primary rounded-2xl py-4 items-center mb-4"
        onPress={() => router.push(`/job/report/add?jobId=${jobId}`)}
      >
        <Text className="text-white font-bold">+ Add Daily Report</Text>
      </TouchableOpacity>

      {reports.length === 0 ? (
        <EmptyState
          emoji="📋"
          title="No reports yet"
          subtitle="Add your first daily report for this job."
        />
      ) : (
        reports.map((report) => (
          <Card key={report.id}>
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-title font-bold text-base">{report.date}</Text>
              <Text className="text-muted text-xs">{report.submittedBy}</Text>
            </View>
            <Text className="text-body text-sm mb-2" numberOfLines={3}>
              {report.workPerformed}
            </Text>
            <View className="flex-row gap-4 border-t border-border pt-2">
              <Text className="text-muted text-xs">🌤 {report.weather}</Text>
              <Text className="text-muted text-xs">👷 {report.crewOnSite}</Text>
            </View>
            {report.issues && report.issues !== "None" && (
              <View className="bg-red-50 rounded-xl p-2 mt-2">
                <Text className="text-red-600 text-xs">⚠️ {report.issues}</Text>
              </View>
            )}
          </Card>
        ))
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}