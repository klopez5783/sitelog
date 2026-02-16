import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Input from "../../ui/Input";

export default function NoteForm({
  content,
  setContent,
  submitting,
  error,
  handleSubmit,
  isEditing = false,
}) {
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      extraScrollHeight={80}
      keyboardShouldPersistTaps="handled"
      keyboardOpeningTime={0}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 60,
      }}
    >
      {/* Note content */}
      <Input
        label="Note *"
        value={content}
        onChangeText={setContent}
        placeholder="Enter notes about the job, safety concerns, client requests, etc."
        multiline
        scrollEnabled={false}
      />

      {/* Error */}
      {error ? (
        <View className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
          <Text className="text-red-600 text-sm">{error}</Text>
        </View>
      ) : null}

      {/* Submit */}
      <TouchableOpacity
        className={`rounded-2xl py-4 items-center ${
          submitting ? "bg-orange-300" : "bg-primary"
        }`}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-base">
            {isEditing ? "Update Note" : "Save Note"}
          </Text>
        )}
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}