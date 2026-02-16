import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ChipSelector from "../../ui/ChipSelector";
import Input from "../../ui/Input";

// ── Source picker buttons ─────────────────────────────────
function SourcePicker({ onCamera, onLibrary, onFile }) {
  return (
    <View className="flex-row gap-3 mb-4">
      <TouchableOpacity
        onPress={onCamera}
        className="flex-1 bg-surface border border-border rounded-2xl py-4 items-center gap-1"
      >
        <Text className="text-2xl">📷</Text>
        <Text className="text-title text-xs font-semibold">Camera</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onLibrary}
        className="flex-1 bg-surface border border-border rounded-2xl py-4 items-center gap-1"
      >
        <Text className="text-2xl">🖼️</Text>
        <Text className="text-title text-xs font-semibold">Photos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onFile}
        className="flex-1 bg-surface border border-border rounded-2xl py-4 items-center gap-1"
      >
        <Text className="text-2xl">📁</Text>
        <Text className="text-title text-xs font-semibold">Files</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Selected file preview ─────────────────────────────────
function FilePreview({ pickedFile, onClear }) {
  const isImage = pickedFile.isImage;

  return (
    <View className="bg-surface border border-border rounded-2xl overflow-hidden mb-4">
      {/* Image preview */}
      {isImage && (
        <Image
          source={{ uri: pickedFile.uri }}
          style={{ width: "100%", height: 180 }}
          resizeMode="cover"
        />
      )}

      {/* File info row */}
      <View className="flex-row items-center gap-3 px-4 py-3">
        <View className="w-10 h-10 bg-orange-100 rounded-xl items-center justify-center">
          <Text className="text-lg">{isImage ? "🖼️" : "📄"}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-title text-sm font-semibold" numberOfLines={1}>
            {pickedFile.name}
          </Text>
          {pickedFile.size ? (
            <Text className="text-muted text-xs mt-0.5">
              {(pickedFile.size / 1024).toFixed(1)} KB
            </Text>
          ) : null}
        </View>
        <TouchableOpacity onPress={onClear} className="p-1">
          <Text className="text-muted text-lg">✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Main form ─────────────────────────────────────────────
export default function DocumentForm({
  CATEGORIES,
  selectedCategory,
  setSelectedCategory,
  pickedFile,
  pickDocument,
  pickFromLibrary,
  takePhoto,
  clearFile,
  name,
  setName,
  submitting,
  error,
  handleSubmit,
  description,
  setDescription,
}) {
  const categoryOptions = CATEGORIES.map((c) => ({
    id: c.id,
    label: `${c.emoji} ${c.name}`,
  }));

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
      {/* Category */}
      <Text className="text-muted text-sm font-semibold mb-2">Category *</Text>
      <View className="mb-4">
        <ChipSelector
          options={categoryOptions}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          peek={false}
          allowDeselect={true}
        />
      </View>

      {/* File source / preview */}
      <Text className="text-muted text-sm font-semibold mb-2">File *</Text>
      {pickedFile ? (
        <FilePreview pickedFile={pickedFile} onClear={clearFile} />
      ) : (
        <SourcePicker
          onCamera={takePhoto}
          onLibrary={pickFromLibrary}
          onFile={pickDocument}
        />
      )}

      {/* Display name */}
      <Input
        label="Document Name *"
        value={name}
        onChangeText={setName}
        placeholder="e.g. Electrical Permit, Site Plan Rev 2"
        scrollEnabled={false}
      />

      <Input
        label="Description (optional)"
        value={description}
        onChangeText={setDescription}
        placeholder="Any problems, delays, or items to flag..."
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
          <Text className="text-white font-bold text-base">Save Document</Text>
        )}
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}
