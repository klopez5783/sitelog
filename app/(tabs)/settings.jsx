import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import Screen from "../../components/ui/Screen";
import Button from "../../components/ui/Button";
import { signOut } from "../../lib/useAuth";
import { useJobStore } from "../../store/useJobStore";

export default function Settings() {
  const router = useRouter();
  const { setUser, setCompanyId } = useJobStore();

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setCompanyId(null);
      router.replace("/(auth)/login");
    } catch (e) {
      console.log("Sign out error:", e);
    }
  };

  return (
    <Screen>
      <View className="flex-1 items-center justify-center">
        <Text className="text-title text-lg font-bold">Settings</Text>
        <Text className="text-muted text-sm mt-1">Coming soon</Text>
        <Button
          label="Sign Out"
          onPress={handleSignOut}
          variant="primary"
          className="mt-6"
        />
      </View>
    </Screen>
  );
}