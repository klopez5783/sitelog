import { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Pressable,
} from "react-native";
import Input from "../../ui/Input";
import CrewSelector from "./CrewSelector";
import ReportImagePicker from "./ReportImagePicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ChipSelector from "../../ui/ChipSelector";

const WEATHER_OPTIONS = [
  "☀️ Clear",
  "⛅ Cloudy",
  "🌧 Rain",
  "🌬 Windy",
  "❄️ Cold",
  "🏡 Indoors",
];


// ── Scroll-peek hint on mount ─────────────────────────────
function WeatherChipRow({ form, updateField }) {
  return (
    <View className="mb-4">
      <Text className="text-muted text-sm font-semibold mb-2">Weather</Text>
      <ChipSelector
        options={WEATHER_OPTIONS.map((o) => ({ id: o, label: o }))}
        selected={form.weather}
        onSelect={(id) => updateField("weather", id ?? "")}
        peek={true}
      />
      <View className="mt-2">
        <Input
          value={form.weather}
          onChangeText={(v) => updateField("weather", v)}
          placeholder='e.g. "Clear, 68°F"'
        />
      </View>
    </View>
  );
}
// ─────────────────────────────────────────────────────────

export default function ReportForm({
  form,
  updateField,
  assignedCrew,
  selectedCrew,
  onToggleCrew,
  extraCrew,
  onExtraCrewChange,
  images,
  onCamera,
  onLibrary,
  onRemoveImage,
  submitting,
  error,
  handleSubmit,
}) {
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      enableAutomaticScroll         
      extraScrollHeight={70}
      keyboardShouldPersistTaps="handled"
      keyboardOpeningTime={0}
      contentContainerStyle={{
        paddingBottom: 10,
        paddingHorizontal: 16,
        flexGrow: 1,
      }}
    >
        {/* Date */}
        <Input
          label="Date"
          value={form.date}
          onChangeText={(v) => updateField("date", v)}
          placeholder="YYYY-MM-DD"
        />

        {/* Weather */}
        <WeatherChipRow form={form} updateField={updateField} />

        {/* Crew Selector */}
        <CrewSelector
          crew={assignedCrew}
          selected={selectedCrew}
          onToggle={onToggleCrew}
          extra={extraCrew}
          onExtraChange={onExtraCrewChange}
        />

        {/* Work Performed */}
        <Input
          label="Work Performed *"
          value={form.workPerformed}
          onChangeText={(v) => updateField("workPerformed", v)}
          placeholder="Describe the work completed today..."
          multiline
          scrollEnabled={false}
        />

        {/* Issues */}
        <Input
          label="Issues / Delays (optional)"
          value={form.issues}
          onChangeText={(v) => updateField("issues", v)}
          placeholder="Any problems, delays, or items to flag..."
          multiline
          scrollEnabled={false}
        />

        {/* Photos */}
        <ReportImagePicker
          images={images}
          onCamera={onCamera}
          onLibrary={onLibrary}
          onRemove={onRemoveImage}
        />

        {/* Error */}
        {error ? (
          <View className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
            <Text className="text-red-600 text-sm">{error}</Text>
          </View>
        ) : null}

        {/* Submit */}
        <TouchableOpacity
          className={`rounded-2xl py-4 items-center mb-4 ${
            submitting ? "bg-orange-300" : "bg-primary"
          }`}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-base">
              {`Save Report${
                images.length > 0
                  ? ` + ${images.length} Photo${images.length !== 1 ? "s" : ""}`
                  : ""
              }`}
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
    </KeyboardAwareScrollView>
  );
}
