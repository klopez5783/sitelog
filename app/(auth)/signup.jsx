import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useJobStore } from "../../store/useJobStore";
import { signUp } from "../../lib/useAuth";
import Input from "../../components/ui/Input";

export default function SignUpScreen() {
  const router = useRouter();
  const { setUser, setCompanyId } = useJobStore();

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateCompanyId = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 30);
  };

  const handleSignUp = async () => {
    setError("");

    if (!name || !companyName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const userData = await signUp(name, companyName, email, password);
      setUser(userData);
      setCompanyId(userData.companyId);
      router.replace("/(tabs)");
    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (e.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-dark"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Header */}
          <View className="mb-10">
            <Text className="text-primary text-4xl font-bold">SiteLog</Text>
            <Text className="text-muted text-base mt-1">
              Create your account
            </Text>
          </View>

          {/* Name */}
          <Text className="text-muted text-sm mb-1 ml-1">Your Name</Text>
          <Input
            className="bg-surface text-black rounded-xl px-4 py-4 mb-4 text-base"
            placeholder="John Smith"
            placeholderTextColor="#6B7280"
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
          />

          {/* Company Name */}
          <Text className="text-muted text-sm mb-1 ml-1">Company Name</Text>
          <Input
            className="bg-surface text-black rounded-xl px-4 py-4 mb-4 text-base"
            placeholder="Smith Construction LLC"
            placeholderTextColor="#6B7280"
            autoCapitalize="words"
            value={companyName}
            onChangeText={setCompanyName}
          />

          {/* Email */}
          <Text className="text-muted text-sm mb-1 ml-1">Email</Text>
          <Input
            className="bg-surface text-black rounded-xl px-4 py-4 mb-4 text-base"
            placeholder="john@smithconstruction.com"
            placeholderTextColor="#6B7280"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {/* Password */}
          <Text className="text-muted text-sm mb-1 ml-1">Password</Text>
          <Input
            className="bg-surface text-black rounded-xl px-4 py-4 mb-4 text-base"
            placeholder="At least 6 characters"
            placeholderTextColor="#6B7280"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Confirm Password */}
          <Text className="text-muted text-sm mb-1 ml-1">Confirm Password</Text>
          <Input
            className="bg-surface text-black rounded-xl px-4 py-4 mb-4 text-base"
            placeholder="Re-enter your password"
            placeholderTextColor="#6B7280"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* Error */}
          {error ? (
            <Text className="text-red-400 text-sm mb-3">{error}</Text>
          ) : null}

          {/* Sign Up Button */}
          <TouchableOpacity
            className="bg-primary rounded-xl py-4 items-center mt-2"
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-black font-bold text-base">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            className="items-center mt-6"
            onPress={() => router.replace("/(auth)/login")}
          >
            <Text className="text-muted text-sm">
              Already have an account?{" "}
              <Text className="text-primary font-semibold">Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center items-center mt-4 px-8">
          <Text className="text-muted text-xs text-center">
            By signing up, you agree to our{" "}
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://your-privacy-policy-url-here")
            }
          >
            <Text className="text-primary text-xs">Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
