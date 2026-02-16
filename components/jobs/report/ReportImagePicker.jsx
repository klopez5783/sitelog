import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";

export default function ReportImagePicker({ images, onCamera, onLibrary, onRemove }) {
  return (
    <View className="mb-4">
      <Text className="text-muted text-sm font-semibold mb-2">Photos</Text>

      {/* Thumbnails */}
      {images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
          <View className="flex-row gap-2 pr-4">
            {images.map((uri) => (
              <View key={uri} className="relative">
                <Image
                  source={{ uri }}
                  className="w-24 h-24 rounded-2xl bg-border"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => onRemove(uri)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full items-center justify-center"
                >
                  <Text className="text-white text-xs font-bold">✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Add Buttons */}
      <View className="flex-row gap-3">
        <TouchableOpacity
          className="flex-1 bg-surface border border-border rounded-2xl py-3 items-center"
          onPress={onCamera}
        >
          <Text className="text-xl mb-0.5">📷</Text>
          <Text className="text-title text-xs font-semibold">Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-surface border border-border rounded-2xl py-3 items-center"
          onPress={onLibrary}
        >
          <Text className="text-xl mb-0.5">🖼️</Text>
          <Text className="text-title text-xs font-semibold">Library</Text>
        </TouchableOpacity>
      </View>

      {images.length > 0 && (
        <Text className="text-muted text-xs mt-2 text-center">
          {images.length} photo{images.length !== 1 ? "s" : ""} added
        </Text>
      )}
    </View>
  );
}