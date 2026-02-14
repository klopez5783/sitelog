import { Redirect } from "expo-router";
import { useJobStore } from "../store/useJobStore";

export default function Index() {
  const { user, isDemo } = useJobStore();

  if (user || isDemo) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}