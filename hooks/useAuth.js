import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, useSegments } from "expo-router";
import { auth, db } from "../lib/firebase";
import {useJobStore} from "../store/useJobsStore";

export function useAuth() {
  const router = useRouter();
  const segments = useSegments();
  const { setUser, setCompanyId, isDemo } = useJobStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const inAuth = segments[0] === "(auth)";

      if (firebaseUser) {
        // Get user doc to find companyId
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...userData });
          setCompanyId(userData.companyId);
        }
        if (inAuth) router.replace("/(tabs)");
      } else {
        if (!isDemo && !inAuth) router.replace("/(auth)/login");
      }
    });

    return unsubscribe;
  }, [segments]);
}