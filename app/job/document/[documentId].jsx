import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useJobStore } from "../../../store/useJobStore";
import { getDocument, deleteDocument } from "../../../lib/firestore";
import Screen from "../../../components/ui/Screen";

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

export default function DocumentDetail() {
  const { documentId, jobId } = useLocalSearchParams();
  const router = useRouter();
  const { companyId, isDemo } = useJobStore();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (!isDemo) {
          const data = await getDocument(companyId, jobId, documentId);
          setDocument(data);
        }
      } catch (e) {
        console.log("Error loading document:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [documentId]);

  const handleDownload = () => {
    if (document?.downloadUrl) {
      Linking.openURL(document.downloadUrl);
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Document", "This cannot be undone. Delete this document?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            if (!isDemo) await deleteDocument(companyId, jobId, documentId);
            router.back();
          } catch (e) {
            console.log("Error deleting document:", e);
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

  if (!document) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-4xl mb-3">📄</Text>
          <Text className="text-title font-bold text-base">Document not found</Text>
        </View>
      </Screen>
    );
  }

  const isImage = document.mimeType?.startsWith("image/");
  const isPDF = document.mimeType?.includes("pdf");

  return (
    <Screen>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Text className="text-primary text-base font-semibold">← Back</Text>
        </TouchableOpacity>
        <Text className="text-title font-bold text-base">Document</Text>
        <View className="flex-row gap-3">
          <TouchableOpacity onPress={handleDownload}>
            <Text className="text-primary text-sm font-semibold">Download</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Text className="text-red-500 text-sm font-semibold">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Document preview */}
        {isImage ? (
          <TouchableOpacity
            onPress={handleDownload}
            className="bg-surface border border-border rounded-2xl overflow-hidden mb-4"
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: document.downloadUrl }}
              style={{ width: "100%", height: 300 }}
              resizeMode="contain"
            />
            <View className="absolute bottom-2 right-2 bg-black/60 rounded-lg px-2 py-1">
              <Text className="text-white text-xs">Tap to view full size</Text>
            </View>
          </TouchableOpacity>
        ) : isPDF ? (
          <View className="bg-surface border border-border rounded-2xl p-6 items-center mb-4">
            <Text className="text-5xl mb-2">📄</Text>
            <Text className="text-title font-semibold text-sm mb-1">PDF Document</Text>
            <Text className="text-muted text-xs text-center mb-3">
              Tap Download to view this PDF
            </Text>
            <TouchableOpacity
              onPress={handleDownload}
              className="bg-primary rounded-xl px-4 py-2"
            >
              <Text className="text-white font-semibold text-sm">Open PDF</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-surface border border-border rounded-2xl p-6 items-center mb-4">
            <Text className="text-5xl mb-2">📁</Text>
            <Text className="text-title font-semibold text-sm mb-1">{document.fileName}</Text>
            <Text className="text-muted text-xs text-center mb-3">
              Tap Download to open this file
            </Text>
            <TouchableOpacity
              onPress={handleDownload}
              className="bg-primary rounded-xl px-4 py-2"
            >
              <Text className="text-white font-semibold text-sm">Download File</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Document metadata */}
        <InfoRow label="Name" value={document.name} />
        <InfoRow label="Category" value={document.category} />
        <InfoRow label="File Name" value={document.fileName} />
        <InfoRow
          label="File Size"
          value={document.fileSize ? `${(document.fileSize / 1024).toFixed(1)} KB` : "—"}
        />
        <InfoRow label="Uploaded By" value={document.uploadedBy} />
        <InfoRow
          label="Uploaded At"
          value={new Date(document.uploadedAt?.toDate?.() || document.uploadedAt).toLocaleString()}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </Screen>
  );
}