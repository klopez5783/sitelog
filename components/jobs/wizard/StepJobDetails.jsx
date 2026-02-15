import { View, Text } from "react-native";
import Input from "../../ui/Input";

export default function StepJobDetails({
  name,
  setName,
  description,
  setDescription,
}) {
  return (
    <View>
      <View className="items-center mb-6">
        <View className="w-16 h-16 bg-orange-100 rounded-full items-center justify-center mb-3">
          <Text className="text-3xl">🏗️</Text>
        </View>
        <Text className="text-title text-2xl font-bold">Job Details</Text>
        <Text className="text-muted text-sm mt-1 text-center">
          Start with the basics — what's the job?
        </Text>
      </View>

      <Input
        label="Job Name *"
        value={name}
        onChangeText={setName}
        placeholder="Kitchen Remodel - Johnson Residence"
        returnKeyType="next"
      />
      <Input
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Describe the scope of work..."
        multiline
        returnKeyType="done"
      />
    </View>
  );
}
