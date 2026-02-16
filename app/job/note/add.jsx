import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Screen from "../../../components/ui/Screen";
import NoteForm from "../../../components/jobs/note/NoteForm";
import { useAddNote } from "../../../hooks/useAddNote";

export default function AddNote() {
  const router = useRouter();
  const props = useAddNote();

  return (
    <Screen>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Text className="text-primary text-base font-semibold">← Back</Text>
        </TouchableOpacity>
        <Text className="text-title font-bold text-base">Add Note</Text>
        <View style={{ width: 60 }} />
      </View>

      <NoteForm {...props} />
    </Screen>
  );
}