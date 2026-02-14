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
import {useJobStore} from "../../store/useJobStore";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { signIn } from "../../lib/useAuth";

export default function LoginScreen() {
  const router = useRouter();
  const { enterDemo, setUser, setCompanyId } = useJobStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 const handleLogin = async () => {
  if (!email || !password) {
    setError("Please enter your email and password.");
    return;
  }
  setLoading(true);
  setError("");
  try {
    const userData = await signIn(email, password);
    setUser(userData);
    setCompanyId(userData.companyId);
    router.replace("/(tabs)");
  } catch (e) {
    setError("Invalid email or password.");
    console.log("Login error:", e);
  } finally {
    setLoading(false);
  }
};

  const handleDemo = () => {
    enterDemo();
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-12">

          {/* Logo */}
          <View className="mb-10">
            <Text className="text-primary text-4xl font-bold">SiteLog</Text>
            <Text className="text-muted text-base mt-1">
              Job documentation for the field
            </Text>
          </View>

          {/* Fields */}
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@company.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />

          {error ? (
            <Text className="text-danger text-sm mb-3">{error}</Text>
          ) : null}

          {/* Sign In */}
          <Button label="Sign In" onPress={handleLogin} loading={loading} />

          {/* Divider */}
          <View className="flex-row items-center my-5">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-muted text-sm mx-4">or</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Demo */}
          <Button label="Try Demo" onPress={handleDemo} variant="outline" />
          <Text className="text-muted text-xs text-center mt-2">
            Explore with sample jobs — no account needed
          </Text>

          {/* Sign Up */}
          <TouchableOpacity
            className="items-center mt-8"
            onPress={() => router.replace("/(auth)/signup")}
          >
            <Text className="text-muted text-sm">
              Don't have an account?{" "}
              <Text className="text-primary font-semibold">Create one</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}