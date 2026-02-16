import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Screen from "../../../components/ui/Screen";
import DocumentForm from "../../../components/jobs/document/DocumentForm";
import { useAddDocument } from "../../../hooks/useAddDocument";

export default function AddDocument() {
  const router = useRouter();
  const props = useAddDocument();

  return (
    <Screen>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Text className="text-primary text-base font-semibold">← Back</Text>
        </TouchableOpacity>
        <Text className="text-title font-bold text-base">Add Document</Text>
        <View style={{ width: 60 }} />
      </View>

      <DocumentForm {...props} />
    </Screen>
  );
}