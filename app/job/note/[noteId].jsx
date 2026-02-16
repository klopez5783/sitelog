import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useJobStore } from "../../../store/useJobStore";
import { getNote, updateNote, deleteNote } from "../../../lib/firestore";
import Screen from "../../../components/ui/Screen";
import NoteForm from "../../../components/jobs/note/NoteForm";

export default function NoteDetail() {
  const { noteId, jobId } = useLocalSearchParams();
  const router = useRouter();
  const { companyId, isDemo } = useJobStore();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        if (!isDemo) {
          const data = await getNote(companyId, jobId, noteId);
          setNote(data);
          setContent(data?.content || "");
        }
      } catch (e) {
        console.log("Error loading note:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [noteId]);

  const handleSave = async () => {
    if (!content.trim()) {
      setError("Please enter a note.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        content: content.trim(),
        updatedAt: new Date().toISOString(),
      };

      if (!isDemo) {
        await updateNote(companyId, jobId, noteId, payload);
      }

      setNote({ ...note, ...payload });
      setIsEditing(false);
    } catch (e) {
      console.log("Error updating note:", e);
      setError("Failed to update note. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Note", "This cannot be undone. Delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            if (!isDemo) await deleteNote(companyId, jobId, noteId);
            router.back();
          } catch (e) {
            console.log("Error deleting note:", e);
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

  if (!note) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-4xl mb-3">📝</Text>
          <Text className="text-title font-bold text-base">Note not found</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Text className="text-primary text-base font-semibold">← Back</Text>
        </TouchableOpacity>
        <Text className="text-title font-bold text-base">Note</Text>
        <View className="flex-row gap-3">
          {isEditing ? (
            <TouchableOpacity onPress={() => setIsEditing(false)}>
              <Text className="text-muted text-sm font-semibold">Cancel</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Text className="text-primary text-sm font-semibold">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Text className="text-red-500 text-sm font-semibold">Delete</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {isEditing ? (
        <NoteForm
          content={content}
          setContent={setContent}
          submitting={submitting}
          error={error}
          handleSubmit={handleSave}
          isEditing
        />
      ) : (
        <View className="flex-1 px-4 pt-4">
          <View className="bg-surface border border-border rounded-2xl p-4 mb-4">
            <Text className="text-title text-sm leading-relaxed">{note.content}</Text>
          </View>

          <View className="border-t border-border pt-3">
            <Text className="text-muted text-xs">
              Created by {note.createdBy} on{" "}
              {new Date(note.createdAt?.toDate?.() || note.createdAt).toLocaleString()}
            </Text>
            {note.updatedAt && (
              <Text className="text-muted text-xs mt-1">
                Last updated {new Date(note.updatedAt?.toDate?.() || note.updatedAt).toLocaleString()}
              </Text>
            )}
          </View>
        </View>
      )}
    </Screen>
  );
}