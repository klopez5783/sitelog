import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

// Convert MM/DD/YYYY string → Date object
const parseDate = (dateStr) => {
  if (!dateStr) return new Date();
  const [month, day, year] = dateStr.split("/");
  const parsed = new Date(year, month - 1, day);
  return isNaN(parsed) ? new Date() : parsed;
};

// Convert Date object → MM/DD/YYYY string
const formatDate = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export default function DatePickerField({ label, value, onSelect }) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-body text-sm font-semibold mb-1 ml-1">{label}</Text>

      {/* Tappable Field */}
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        className="bg-surface border border-border rounded-2xl px-4 flex-row items-center justify-between"
        style={{ height: 52 }}
      >
        <Text className={`text-base ${value ? "text-title" : "text-muted"}`}>
          {value || "MM/DD/YYYY"}
        </Text>
        <Text className="text-lg">📅</Text>
      </TouchableOpacity>

      {/* iOS — Bottom Sheet Modal */}
      {Platform.OS === "ios" && (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.4)",
              justifyContent: "flex-end",
            }}
          >
            <View className="bg-surface rounded-t-3xl">
              {/* Modal Header */}
              <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text className="text-muted font-semibold text-base">Cancel</Text>
                </TouchableOpacity>
                <Text className="text-title font-bold text-base">Select Date</Text>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text className="text-primary font-semibold text-base">Done</Text>
                </TouchableOpacity>
              </View>

              {/* Spinner */}
              <DateTimePicker
                value={parseDate(value)}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (selectedDate) onSelect(formatDate(selectedDate));
                }}
                style={{ height: 200, alignSelf: "center" }}
                textColor="#000000"
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Android — Native Calendar */}
      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={parseDate(value)}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (event.type === "set" && selectedDate) {
              onSelect(formatDate(selectedDate));
            }
          }}
        />
      )}
    </View>
  );
}