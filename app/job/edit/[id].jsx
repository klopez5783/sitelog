import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useJobStore } from "../../../store/useJobStore";
import { useJobEdit } from "../../../hooks/useJobEdit";
import Screen from "../../../components/ui/Screen";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";

export default function EditJob() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { jobs } = useJobStore();
  const job = jobs.find((j) => j.id === id);

  const edit = useJobEdit(job);

  if (!job) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <Text className="text-title font-bold text-lg">Job not found</Text>
          <TouchableOpacity onPress={() => router.back()} className="mt-4">
            <Text className="text-primary font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-surface border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Text className="text-primary text-2xl">←</Text>
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-title font-bold text-lg">Edit Job</Text>
          <Text className="text-muted text-xs mt-0.5">{job.name}</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-4 pt-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* Job Info */}
          <Text className="text-muted text-xs font-semibold uppercase tracking-widest mb-3">
            Job Info
          </Text>
          <Input label="Job Name *" value={edit.name} onChangeText={edit.setName} placeholder="Kitchen Remodel" />
          <Input label="Description" value={edit.description} onChangeText={edit.setDescription} placeholder="Scope of work..." multiline />

          {/* Location */}
          <Text className="text-muted text-xs font-semibold uppercase tracking-widest mb-3 mt-2">
            Location
          </Text>
          <Input label="Street Address" value={edit.streetAddress} onChangeText={edit.setStreetAddress} placeholder="4821 Oak Street" />
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Input label="City" value={edit.city} onChangeText={edit.setCity} placeholder="Columbus" />
            </View>
            <View className="flex-1">
              <Input label="State" value={edit.state} onChangeText={edit.setState} placeholder="OH" autoCapitalize="characters" />
            </View>
          </View>
          <Input label="Zip Code" value={edit.zipCode} onChangeText={edit.setZipCode} placeholder="43215" keyboardType="numeric" />

          {/* Dates */}
          <Text className="text-muted text-xs font-semibold uppercase tracking-widest mb-3 mt-2">
            Dates
          </Text>
          <Input label="Start Date" value={edit.startDate} onChangeText={edit.setStartDate} placeholder="MM/DD/YYYY" keyboardType="numbers-and-punctuation" />
          <Input label="Estimated Completion" value={edit.estimatedCompletion} onChangeText={edit.setEstimatedCompletion} placeholder="MM/DD/YYYY" keyboardType="numbers-and-punctuation" />

          {/* Crew */}
          <Text className="text-muted text-xs font-semibold uppercase tracking-widest mb-3 mt-2">
            Assigned Crew
          </Text>
          <View className="flex-row gap-2 mb-3">
            <View className="flex-1">
              <Input value={edit.crewInput} onChangeText={edit.setCrewInput} placeholder="Add crew member" autoCapitalize="words" />
            </View>
            <TouchableOpacity
              onPress={edit.addCrewMember}
              className="bg-primary rounded-2xl px-4 mb-4 justify-center"
            >
              <Text className="text-white font-bold">Add</Text>
            </TouchableOpacity>
          </View>
          {edit.crew.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-4">
              {edit.crew.map((member) => (
                <TouchableOpacity
                  key={member}
                  onPress={() => edit.removeCrewMember(member)}
                  className="flex-row items-center bg-orange-100 rounded-full px-3 py-1"
                >
                  <Text className="text-primary text-sm font-semibold mr-1">{member}</Text>
                  <Text className="text-primary text-sm">✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {edit.crew.length > 0 && (
            <Text className="text-muted text-xs mb-4">Tap a name to remove</Text>
          )}

          {/* Client */}
          <Text className="text-muted text-xs font-semibold uppercase tracking-widest mb-3 mt-2">
            Client Info
          </Text>
          <Input label="Client Name *" value={edit.clientName} onChangeText={edit.setClientName} placeholder="Mark Johnson" autoCapitalize="words" />
          <Input label="Client Phone" value={edit.clientPhone} onChangeText={edit.setClientPhone} placeholder="(614) 555-0123" keyboardType="phone-pad" />

          {/* Error */}
          {edit.error ? (
            <Text className="text-danger text-sm mb-3">{edit.error}</Text>
          ) : null}

          {/* Save */}
          <Button
            label="Save Changes"
            onPress={edit.handleSave}
            loading={edit.loading}
            className="mb-10"
          />

        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}