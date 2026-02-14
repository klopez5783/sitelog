import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import Card from "../../ui/Card";

export default function TabOverview({ job, handleComplete, completing }) {
  return (
    <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>

      {/* Complete Button */}
      {job.status === "active" && (
        <TouchableOpacity
          onPress={handleComplete}
          disabled={completing}
          className="bg-green-500 rounded-2xl py-4 items-center mb-4"
        >
          {completing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-base">✓ Mark as Completed</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Completed Banner */}
      {job.status === "completed" && (
        <View className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4 flex-row items-center gap-3">
          <Text className="text-2xl">✅</Text>
          <View>
            <Text className="text-green-700 font-bold">Job Completed</Text>
            <Text className="text-green-600 text-xs mt-0.5">
              {job.completedDate
                ? new Date(job.completedDate).toLocaleDateString()
                : ""}
            </Text>
          </View>
        </View>
      )}

      {/* Job Info */}
      <Card>
        <Text className="text-muted text-xs font-semibold uppercase tracking-widest mb-3">
          Job Info
        </Text>
        <InfoRow label="Client" value={job.clientName} />
        <InfoRow label="Phone" value={job.clientPhone || "Not provided"} />
        <InfoRow label="Location" value={job.location} />
        <InfoRow label="Status" value={job.status} isLast />
      </Card>

      {/* Description */}
      {job.description ? (
        <Card>
          <Text className="text-muted text-xs font-semibold uppercase tracking-widest mb-2">
            Description
          </Text>
          <Text className="text-body text-sm leading-relaxed">{job.description}</Text>
        </Card>
      ) : null}

      {/* Dates */}
      <Card>
        <Text className="text-muted text-xs font-semibold uppercase tracking-widest mb-3">
          Dates
        </Text>
        <InfoRow label="Start Date" value={job.startDate} />
        <InfoRow label="Est. Completion" value={job.estimatedCompletion || "Not set"} isLast />
      </Card>

      {/* Crew */}
      <Card>
        <Text className="text-muted text-xs font-semibold uppercase tracking-widest mb-3">
          Assigned Crew
        </Text>
        {job.assignedCrew && job.assignedCrew.length > 0 ? (
          <View className="flex-row flex-wrap gap-2">
            {job.assignedCrew.map((member, index) => (
              <View key={index} className="bg-orange-100 rounded-full px-3 py-1">
                <Text className="text-primary text-sm font-semibold">{member}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-muted text-sm">No crew assigned</Text>
        )}
      </Card>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function InfoRow({ label, value, isLast = false }) {
  return (
    <View className={`flex-row justify-between py-2 ${!isLast ? "border-b border-border" : ""}`}>
      <Text className="text-muted text-sm">{label}</Text>
      <Text className="text-title text-sm font-semibold flex-1 text-right ml-4" numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}