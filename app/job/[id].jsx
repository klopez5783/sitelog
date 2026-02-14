import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useJobDetail } from "../../hooks/useJobDeatils";
import Screen from "../../components/ui/Screen";
import Badge from "../../components/ui/Badge";
import TabOverview from "../../components/jobs/detail/TabOverview";
import TabReports from "../../components/jobs/detail/TabReports";
import TabDocuments from "../../components/jobs/detail/TabDocuments";
import TabNotes from "../../components/jobs/detail/TabNotes";

const TABS = ["Overview", "Reports", "Documents", "Notes"];

export default function JobDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const detail = useJobDetail(id);
  const { job, reports, documents, notes, activeTab, setActiveTab, loading, completing, handleComplete } = detail;

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#F97316" size="large" />
        </View>
      </Screen>
    );
  }

  if (!job) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-4xl mb-3">🔍</Text>
          <Text className="text-title font-bold text-lg">Job not found</Text>
          <TouchableOpacity onPress={() => router.back()} className="mt-4">
            <Text className="text-primary font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      {/* Header */}
      <View className="px-4 pt-4 pb-3 bg-surface border-b border-border">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Text className="text-primary text-2xl">←</Text>
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-title font-bold text-lg" numberOfLines={1}>
              {job.name}
            </Text>
            <Text className="text-muted text-xs mt-0.5">{job.clientName}</Text>
          </View>
          <Badge
            label={job.status === "active" ? "Active" : "Completed"}
            variant={job.status === "active" ? "active" : "completed"}
          />
        </View>
      </View>

      {/* Tab Bar */}
      <View className="flex-row bg-surface border-b border-border px-4">
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`mr-6 py-3 border-b-2 ${
              activeTab === tab ? "border-primary" : "border-transparent"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                activeTab === tab ? "text-primary" : "text-muted"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      {activeTab === "Overview" && (
        <TabOverview job={job} handleComplete={handleComplete} completing={completing} />
      )}
      {activeTab === "Reports" && (
        <TabReports reports={reports} jobId={id} />
      )}
      {activeTab === "Documents" && (
        <TabDocuments documents={documents} jobId={id} />
      )}
      {activeTab === "Notes" && (
        <TabNotes notes={notes} jobId={id} />
      )}
    </Screen>
  );
}