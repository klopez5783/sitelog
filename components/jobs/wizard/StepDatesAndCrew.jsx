import { View, Text } from 'react-native'
import React from 'react'
import Input from '../../ui/Input'
import { TouchableOpacity } from 'react-native'

export default function StepDatesAndCrew({
  startDate,
  setStartDate,
  estimatedCompletion,
  setEstimatedCompletion,
  crewInput,
  setCrewInput,
  crew,
  addCrewMember,
  removeCrewMember,
}) {
  return (
    <View>
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-3">
              <Text className="text-3xl">📅</Text>
            </View>
            <Text className="text-title text-2xl font-bold">Dates & Crew</Text>
            <Text className="text-muted text-sm mt-1 text-center">
              When does the job start and who's working it?
            </Text>
          </View>
    
          <Input
            label="Start Date *"
            value={startDate}
            onChangeText={setStartDate}
            placeholder="MM/DD/YYYY"
            keyboardType="numbers-and-punctuation"
          />
          <Input
            label="Estimated Completion"
            value={estimatedCompletion}
            onChangeText={setEstimatedCompletion}
            placeholder="MM/DD/YYYY"
            keyboardType="numbers-and-punctuation"
          />
    
          <Text className="text-body text-sm font-semibold mb-1 ml-1">
            Assigned Crew
          </Text>
          <View className="flex-row gap-2 mb-3">
            <View className="flex-1">
              <Input
                value={crewInput}
                onChangeText={setCrewInput}
                placeholder="Add crew member name"
                autoCapitalize="words"
              />
            </View>
            <TouchableOpacity
              onPress={addCrewMember}
              className="bg-primary rounded-2xl px-4 mb-4 justify-center"
            >
              <Text className="text-white font-bold">Add</Text>
            </TouchableOpacity>
          </View>
    
          {crew.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-2">
              {crew.map((member) => (
                <TouchableOpacity
                  key={member}
                  onPress={() => removeCrewMember(member)}
                  className="flex-row items-center bg-orange-100 rounded-full px-3 py-1"
                >
                  <Text className="text-primary text-sm font-semibold mr-1">
                    {member}
                  </Text>
                  <Text className="text-primary text-sm">✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {crew.length > 0 && (
            <Text className="text-muted text-xs mb-2">Tap a name to remove</Text>
          )}
        </View>
  )
}