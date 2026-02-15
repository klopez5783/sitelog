import React from "react";
import { View, Text } from "react-native";
import Input from "../../ui/Input";

export default function WizardProgressBar({
  streetAddress,
  setStreetAddress,
  city,
  setCity,
  state,
  setState,
  zipCode,
  setZipCode,
}) {
  return (
    <View>
      <View className="items-center mb-6">
        <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-3">
          <Text className="text-3xl">📍</Text>
        </View>
        <Text className="text-title text-2xl font-bold">Job Location</Text>
        <Text className="text-muted text-sm mt-1 text-center">
          Where is this job taking place?
        </Text>
      </View>

      <Input
        label="Street Address *"
        value={streetAddress}
        onChangeText={setStreetAddress}
        placeholder="4821 Oak Street"
      />
      <Input
        label="City *"
        value={city}
        onChangeText={setCity}
        placeholder="Columbus"
      />
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Input
            label="State *"
            value={state}
            onChangeText={setState}
            placeholder="OH"
            autoCapitalize="characters"
          />
        </View>
        <View className="flex-1">
          <Input
            label="Zip Code"
            value={zipCode}
            onChangeText={setZipCode}
            placeholder="43215"
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );
}
