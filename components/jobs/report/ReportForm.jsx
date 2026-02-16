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

const WEATHER_OPTIONS = [
  "☀️ Clear",
  "⛅ Cloudy",
  "🌧 Rain",
  "🌬 Windy",
  "❄️ Cold",
  "🏡 Indoors",
];

// ── Animated chip ─────────────────────────────────────────
function WeatherChip({ option, isSelected, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 0.9,
        useNativeDriver: true,
        speed: 50,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 12,
      }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={handlePress}
        className={`px-4 py-2 rounded-2xl border ${
          isSelected ? "bg-primary border-primary" : "bg-surface border-border"
        }`}
      >
        <Text
          className={`text-sm font-semibold ${isSelected ? "text-white" : "text-title"}`}
        >
          {option}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// ── Scroll-peek hint on mount ─────────────────────────────
function WeatherChipRow({ form, updateField }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    // Small delay so layout finishes before scrolling
    const timeout = setTimeout(() => {
      // Peek right to reveal hidden chips
      scrollRef.current?.scrollTo({ x: 140, animated: true });

      // Ease back after 600ms
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: 0, animated: true });
      }, 600);
    }, 900);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View className="mb-4">
      <Text className="text-muted text-sm font-semibold mb-2">Weather</Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-2"
      >
        <View className="flex-row gap-2 pr-4">
          {WEATHER_OPTIONS.map((option) => (
            <WeatherChip
              key={option}
              option={option}
              isSelected={form.weather === option}
              onPress={() =>
                updateField("weather", form.weather === option ? "" : option)
              }
            />
          ))}
        </View>
      </ScrollView>
      <Input
        value={form.weather}
        onChangeText={(v) => updateField("weather", v)}
        placeholder='e.g. "Clear, 68°F"'
      />
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
