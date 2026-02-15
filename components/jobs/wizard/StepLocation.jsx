import { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import Input from "../../ui/Input";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

export default function StepLocation({
  streetAddress,
  setStreetAddress,
  city,
  setCity,
  state,
  setState,
  zipCode,
  setZipCode,
}) {
  const scrollRef = useRef(null);
  const [showStatePicker, setShowStatePicker] = useState(false);

  const handleCityFocus = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 150, animated: true });
    }, 300);
  };

  const handleZipFocus = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  return (
    <>
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 200 }}
      >
        {/* Icon & Title */}
        <View className="items-center mb-6">
          <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-3">
            <Text className="text-3xl">📍</Text>
          </View>
          <Text className="text-title text-2xl font-bold">Job Location</Text>
          <Text className="text-muted text-sm mt-1 text-center">
            Where is this job taking place?
          </Text>
        </View>

        {/* Street Address */}
        <Input
          label="Street Address *"
          value={streetAddress}
          onChangeText={setStreetAddress}
          placeholder="4821 Oak Street"
          returnKeyType="next"
        />

        {/* City */}
        <Input
          label="City *"
          value={city}
          onChangeText={setCity}
          placeholder="Columbus"
          returnKeyType="next"
          onFocus={handleCityFocus}
        />

        {/* State Picker */}
        <View className="mb-4">
          <Text className="text-body text-sm font-semibold mb-1 ml-1">
            State *
          </Text>
          <TouchableOpacity
            onPress={() => setShowStatePicker(true)}
            className="bg-surface border border-border rounded-2xl px-4 flex-row items-center justify-between"
            style={{ height: 52 }}
          >
            <Text className={`text-base ${state ? "text-title" : "text-muted"}`}>
              {state || "Select a state"}
            </Text>
            <Text className="text-muted text-sm">▼</Text>
          </TouchableOpacity>
        </View>

        {/* Zip Code */}
        <Input
          label="Zip Code"
          value={zipCode}
          onChangeText={(text) => {
            const digitsOnly = text.replace(/[^0-9]/g, "");
            if (digitsOnly.length <= 5) setZipCode(digitsOnly);
          }}
          placeholder="43215"
          keyboardType="numeric"
          returnKeyType="done"
          maxLength={5}
          onFocus={handleZipFocus}
        />
      </ScrollView>

      {/* State Picker Modal */}
      <Modal
        visible={showStatePicker}
        animationType="slide"
        transparent
        onRequestClose={() => setShowStatePicker(false)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }}>
          <View className="bg-surface rounded-t-3xl" style={{ maxHeight: "60%" }}>

            {/* Modal Header */}
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
              <Text className="text-title font-bold text-lg">Select State</Text>
              <TouchableOpacity onPress={() => setShowStatePicker(false)}>
                <Text className="text-primary font-semibold text-base">Done</Text>
              </TouchableOpacity>
            </View>

            {/* State List */}
            <FlatList
              data={US_STATES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setState(item);
                    setShowStatePicker(false);
                  }}
                  className={`px-4 py-4 border-b border-border flex-row justify-between items-center ${
                    state === item ? "bg-orange-50" : "bg-surface"
                  }`}
                >
                  <Text className={`text-base ${state === item ? "text-primary font-bold" : "text-title"}`}>
                    {item}
                  </Text>
                  {state === item && (
                    <Text className="text-primary font-bold">✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}