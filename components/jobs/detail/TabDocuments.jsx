import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Card from "../../ui/Card";
import EmptyState from "./EmptyState";

export default function TabDocuments({ documents, jobId }) {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
      <TouchableOpacity
        className="bg-primary rounded-2xl py-4 items-center mb-4"
        onPress={() => router.push(`/job/document/add?jobId=${jobId}`)}
      >
        <Text className="text-white font-bold">+ Upload Document</Text>
      </TouchableOpacity>

      {documents.length === 0 ? (
        <EmptyState
          emoji="📁"
          title="No documents yet"
          subtitle="Upload permits, contracts, or plans."
        />
      ) : (
        documents.map((doc) => (
          <Card key={doc.id}>
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-orange-100 rounded-xl items-center justify-center">
                <Text className="text-lg">📄</Text>
              </View>
              <View className="flex-1">
                <Text className="text-title font-semibold text-sm">{doc.name}</Text>
                <Text className="text-muted text-xs mt-0.5">
                  {new Date(doc.uploadedAt?.toDate?.() || doc.uploadedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </Card>
        ))
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}