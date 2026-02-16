import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Card from "../../ui/Card";
import EmptyState from "./EmptyState";

export default function TabNotes({ notes, jobId }) {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
      <TouchableOpacity
        className="bg-primary rounded-2xl py-4 items-center mb-4"
        onPress={() => router.push(`/job/note/add?jobId=${jobId}`)}
      >
        <Text className="text-white font-bold">+ Add Note</Text>
      </TouchableOpacity>

      {notes.length === 0 ? (
        <EmptyState
          emoji="📝"
          title="No notes yet"
          subtitle="Add notes about the job, safety concerns, or client requests."
        />
      ) : (
        notes.map((note) => (
          <TouchableOpacity
            key={note.id}
            onPress={() => router.push(`/job/note/${note.id}?jobId=${jobId}`)}
            activeOpacity={0.7}
          >
            <Card>
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-muted text-xs">{note.createdBy}</Text>
                <Text className="text-muted text-xs">
                  {new Date(note.createdAt?.toDate?.() || note.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <Text className="text-title text-sm leading-relaxed" numberOfLines={4}>
                {note.content}
              </Text>
              <View className="flex-row justify-end border-t border-border pt-2 mt-2">
                <Text className="text-primary text-xs font-semibold">View →</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}