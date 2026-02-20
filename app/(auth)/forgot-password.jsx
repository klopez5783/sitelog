import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase";
import Screen from "../../components/ui/Screen";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async () => {
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (e) {
      if (e.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else if (e.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center px-8">
          <Text className="text-6xl mb-4">📧</Text>
          <Text className="text-title font-bold text-xl mb-2 text-center">
            Check Your Email
          </Text>
          <Text className="text-muted text-sm text-center mb-8">
            We sent password reset instructions to {email}
          </Text>
          <TouchableOpacity
            className="bg-primary rounded-2xl py-4 px-8"
            onPress={() => router.replace("/login")}
          >
            <Text className="text-white font-bold">Back to Login</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={80}
        keyboardShouldPersistTaps="handled"
        keyboardOpeningTime={0}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 32 }}
      >
        <Text className="text-title font-bold text-3xl mb-2">Reset Password</Text>
        <Text className="text-muted text-sm mb-8">
          Enter your email and we'll send you instructions to reset your password.
        </Text>

        <TextInput
          className="bg-surface border border-border rounded-2xl px-4 py-4 text-title text-base mb-4"
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {error && (
          <View className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
            <Text className="text-red-600 text-sm">{error}</Text>
          </View>
        )}

        <TouchableOpacity
          className={`rounded-2xl py-4 items-center mb-4 ${
            loading ? "bg-orange-300" : "bg-primary"
          }`}
          onPress={handleReset}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-base">Send Reset Link</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} className="items-center">
          <Text className="text-primary text-sm">← Back to Login</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </Screen>
  );
}