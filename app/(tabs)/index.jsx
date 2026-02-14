import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useJobStore } from "../../store/useJobStore";
import { getJobs } from "../../lib/firestore";
import Screen from "../../components/ui/Screen";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import DemoBanner from "../../components/ui/DemoBanner";

export default function JobBoard() {
  const router = useRouter();
  const { jobs, setJobs, companyId, isDemo, user } = useJobStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("active");

  const fetchJobs = async () => {
    if (isDemo) {
      setLoading(false);
      return;
    }
    try {
      const data = await getJobs(companyId);
      setJobs(data);
    } catch (e) {
      console.log("Error fetching jobs:", e);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [companyId]);

  const filteredJobs = jobs.filter((job) => job.status === filter);
  const activeCount = jobs.filter((j) => j.status === "active").length;
  const completedCount = jobs.filter((j) => j.status === "completed").length;

  return (
    <Screen>
      <DemoBanner />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="px-4 pt-6 pb-2">
          <Text className="text-muted text-sm">Welcome back,</Text>
          <Text className="text-title text-2xl font-bold">
            {user?.name || "there"} 👋
          </Text>
        </View>

        {/* Stats Row */}
        <View className="flex-row px-4 gap-3 mt-4">
          <Card className="flex-1 items-center py-4 mb-0">
            <Text className="text-primary text-3xl font-bold">{activeCount}</Text>
            <Text className="text-muted text-xs mt-1">Active Jobs</Text>
          </Card>
          <Card className="flex-1 items-center py-4 mb-0">
            <Text className="text-title text-3xl font-bold">{completedCount}</Text>
            <Text className="text-muted text-xs mt-1">Completed</Text>
          </Card>
        </View>

        {/* New Job Button */}
        <View className="px-4 mt-4">
          <TouchableOpacity
            className="bg-primary rounded-2xl py-4 items-center"
            onPress={() => router.push("/job/create")}
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base">+ New Job</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View className="flex-row px-4 mt-6 mb-2 gap-2">
          {["active", "completed"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full border ${
                filter === tab
                  ? "bg-primary border-primary"
                  : "bg-surface border-border"
              }`}
            >
              <Text
                className={`text-sm font-semibold capitalize ${
                  filter === tab ? "text-white" : "text-muted"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Job List */}
        <View className="px-4 mt-2 pb-10">
          {loading ? (
            <ActivityIndicator color="#F97316" className="mt-10" />
          ) : filteredJobs.length === 0 ? (
            <View className="items-center mt-16">
              <Text className="text-4xl mb-3">🏗️</Text>
              <Text className="text-title font-semibold text-base">
                No {filter} jobs
              </Text>
              <Text className="text-muted text-sm mt-1 text-center">
                {filter === "active"
                  ? "Tap '+ New Job' to create your first job."
                  : "Completed jobs will appear here."}
              </Text>
            </View>
          ) : (
            filteredJobs.map((job) => (
              <TouchableOpacity
                key={job.id}
                onPress={() => router.push(`/job/${job.id}`)}
                activeOpacity={0.8}
              >
                <Card>
                  {/* Top Row */}
                  <View className="flex-row items-start justify-between mb-2">
                    <Text className="text-title font-bold text-base flex-1 pr-2">
                      {job.name}
                    </Text>
                    <Badge
                      label={job.status === "active" ? "Active" : "Completed"}
                      variant={job.status === "active" ? "active" : "completed"}
                    />
                  </View>

                  {/* Client */}
                  <Text className="text-muted text-sm mb-1">
                    👤 {job.clientName}
                  </Text>

                  {/* Location */}
                  <Text className="text-muted text-sm mb-3">
                    📍 {job.location}
                  </Text>

                  {/* Footer */}
                  <View className="flex-row justify-between border-t border-border pt-3">
                    <Text className="text-muted text-xs">
                      Started {job.startDate}
                    </Text>
                    <Text className="text-muted text-xs">
                      Est. {job.estimatedCompletion}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}