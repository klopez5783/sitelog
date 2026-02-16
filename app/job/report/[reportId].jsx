import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Modal,
  Dimensions,
  StatusBar,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useJobStore } from "../../../store/useJobStore";
import { getReport, deleteReport } from "../../../lib/firestore";
import Screen from "../../../components/ui/Screen";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// ── Full-screen photo viewer ──────────────────────────────
function PhotoViewer({ photos, initialIndex, visible, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset index when opening
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, visible]);

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar hidden />
      <View style={{ flex: 1, backgroundColor: "#000" }}>

        {/* Close button */}
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: "absolute",
            top: 48,
            right: 20,
            zIndex: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: 20,
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>✕</Text>
        </TouchableOpacity>

        {/* Photo counter */}
        {photos.length > 1 && (
          <View
            style={{
              position: "absolute",
              top: 54,
              left: 0,
              right: 0,
              zIndex: 10,
              alignItems: "center",
            }}
          >
            <View style={{ backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 }}>
              <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>
                {currentIndex + 1} / {photos.length}
              </Text>
            </View>
          </View>
        )}

        {/* Swipeable photo list */}
        <FlatList
          data={photos}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentIndex(index);
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={1}
              onPress={onClose}
              style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, justifyContent: "center" }}
            >
              <Image
                source={{ uri: item }}
                style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
          keyExtractor={(_, i) => String(i)}
        />

        {/* Dot indicators */}
        {photos.length > 1 && (
          <View
            style={{
              position: "absolute",
              bottom: 40,
              left: 0,
              right: 0,
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {photos.map((_, i) => (
              <View
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: i === currentIndex ? "#fff" : "rgba(255,255,255,0.4)",
                }}
              />
            ))}
          </View>
        )}
      </View>
    </Modal>
  );
}
// ─────────────────────────────────────────────────────────

function InfoRow({ label, value }) {
  return (
    <View className="py-3 border-b border-border">
      <Text className="text-muted text-xs font-semibold uppercase tracking-widest mb-1">
        {label}
      </Text>
      <Text className="text-title text-sm leading-relaxed">{value || "—"}</Text>
    </View>
  );
}

export default function ReportDetail() {
  const { reportId, jobId } = useLocalSearchParams();
  const router = useRouter();
  const { companyId, isDemo } = useJobStore();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // Photo viewer state
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        if (!isDemo) {
          const data = await getReport(companyId, jobId, reportId);
          setReport(data);
        }
      } catch (e) {
        console.log("Error loading report:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [reportId]);

  const openPhoto = (index) => {
    setViewerIndex(index);
    setViewerVisible(true);
  };

  const handleDelete = () => {
    Alert.alert("Delete Report", "This cannot be undone. Delete this report?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            if (!isDemo) await deleteReport(companyId, jobId, reportId);
            router.back();
          } catch (e) {
            console.log("Error deleting report:", e);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#F97316" />
        </View>
      </Screen>
    );
  }

  if (!report) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-4xl mb-3">📋</Text>
          <Text className="text-title font-bold text-base">Report not found</Text>
        </View>
      </Screen>
    );
  }

  const photos = report.photos || [];

  return (
    <Screen>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Text className="text-primary text-base font-semibold">← Back</Text>
        </TouchableOpacity>
        <Text className="text-title font-bold text-base">Daily Report</Text>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => router.push(`/job/report/edit/${reportId}?jobId=${jobId}`)}
          >
            <Text className="text-primary text-sm font-semibold">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Text className="text-red-500 text-sm font-semibold">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <InfoRow label="Date" value={report.date} />
        <InfoRow label="Submitted By" value={report.submittedBy} />
        <InfoRow label="Weather" value={report.weather} />
        <InfoRow label="Crew On Site" value={report.crewOnSite} />
        <InfoRow label="Work Performed" value={report.workPerformed} />
        <InfoRow
          label="Issues / Delays"
          value={report.issues === "None" ? "No issues reported" : report.issues}
        />

        {/* Photos */}
        {photos.length > 0 && (
          <View className="mt-4">
            <Text className="text-muted text-xs font-semibold uppercase tracking-widest mb-3">
              Photos ({photos.length})
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {photos.map((url, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => openPhoto(index)}
                  activeOpacity={0.85}
                >
                  <Image
                    source={{ uri: url }}
                    style={{ width: 100, height: 100, borderRadius: 16 }}
                    resizeMode="cover"
                  />
                  {/* Expand hint on first photo only */}
                  {index === 0 && photos.length > 0 && (
                    <View
                      style={{
                        position: "absolute",
                        bottom: 6,
                        right: 6,
                        backgroundColor: "rgba(0,0,0,0.55)",
                        borderRadius: 8,
                        paddingHorizontal: 5,
                        paddingVertical: 2,
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 10 }}>⛶</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Full-screen viewer */}
      <PhotoViewer
        photos={photos}
        initialIndex={viewerIndex}
        visible={viewerVisible}
        onClose={() => setViewerVisible(false)}
      />
    </Screen>
  );
}