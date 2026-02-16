import { View, Text, TouchableOpacity, TextInput, Platform } from "react-native";

export default function CrewSelector({
  crew = [],
  selected,
  onToggle,
  extra,
  onExtraChange,
}) {
  return (
    <View className="mb-4">
      <Text className="text-muted text-sm font-semibold mb-2">Crew On Site *</Text>

      {/* Assigned Crew Chips */}
      {crew.length > 0 ? (
        <View className="flex-row flex-wrap gap-2 mb-3">
          {crew.map((member) => {
            const isSelected = selected.includes(member);
            return (
              <TouchableOpacity
                key={member}
                onPress={() => onToggle(member)}
                className={`flex-row items-center px-3 py-2 rounded-full border ${
                  isSelected
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                }`}
              >
                {isSelected && (
                  <Text className="text-white text-xs mr-1">✓</Text>
                )}
                <Text
                  className={`text-sm font-semibold ${
                    isSelected ? "text-white" : "text-title"
                  }`}
                >
                  {member}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}

      {/* Extra / Not On List */}
      <View className="bg-surface border border-border rounded-2xl px-4 py-3">
        <Text className="text-muted text-xs mb-1">Add someone not on the list</Text>
        <TextInput
          value={extra}
          onChangeText={onExtraChange}
          placeholder='e.g. "Sub contractor, temp worker"'
          placeholderTextColor="#9CA3AF"
          className="text-title text-sm"
          style={Platform.OS === "android" ? { paddingVertical: 0 } : undefined}
        />
      </View>

      {/* Summary */}
      {(selected.length > 0 || extra.trim()) && (
        <View className="mt-2 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-2">
          <Text className="text-primary text-xs font-semibold">
            👷{" "}
            {[...selected, ...(extra.trim() ? [extra.trim()] : [])]
              .join(", ")}
          </Text>
        </View>
      )}
    </View>
  );
}