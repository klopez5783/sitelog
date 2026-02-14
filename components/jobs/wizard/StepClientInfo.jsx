import { View, Text } from "react-native";
import React from "react";
import Input from "../../ui/Input";


export default function StepClientInfo({
  clientName,
  setClientName,
  clientPhone,
  setClientPhone,
  name,
  getFullAddress,
  startDate,
  estimatedCompletion,
  crew,
}) {
  return (
    <View>
      <View className="items-center mb-6">
        <View className="w-16 h-16 bg-purple-100 rounded-full items-center justify-center mb-3">
          <Text className="text-3xl">👤</Text>
        </View>
        <Text className="text-title text-2xl font-bold">Client Info</Text>
        <Text className="text-muted text-sm mt-1 text-center">
          Who is the client for this job?
        </Text>
      </View>

      <Input
        label="Client Name *"
        value={clientName}
        onChangeText={setClientName}
        placeholder="Mark Johnson"
        autoCapitalize="words"
      />
      <Input
        label="Client Phone"
        value={clientPhone}
        onChangeText={setClientPhone}
        placeholder="(614) 555-0123"
        keyboardType="phone-pad"
      />

      {/* Summary */}
      <View className="bg-background border border-border rounded-2xl p-4 mt-2">
        <Text className="text-title font-bold mb-3">Job Summary</Text>

        <View className="flex-row justify-between mb-2">
          <Text className="text-muted text-sm">Job Name</Text>
          <Text
            className="text-title text-sm font-semibold flex-1 text-right ml-4"
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-muted text-sm">Location</Text>
          <Text
            className="text-title text-sm font-semibold flex-1 text-right ml-4"
            numberOfLines={2}
          >
            {getFullAddress()}
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-muted text-sm">Start Date</Text>
          <Text className="text-title text-sm font-semibold">{startDate}</Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-muted text-sm">Est. Completion</Text>
          <Text className="text-title text-sm font-semibold">
            {estimatedCompletion || "Not set"}
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-muted text-sm">Crew</Text>
          <Text className="text-title text-sm font-semibold">
            {crew.length > 0 ? crew.join(", ") : "Not assigned"}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-muted text-sm">Client</Text>
          <Text className="text-title text-sm font-semibold">
            {clientName || "Not set"}
          </Text>
        </View>
      </View>
    </View>
  );
}
