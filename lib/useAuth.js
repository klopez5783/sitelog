import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import { useEffect, useState } from "react";
import { useJobStore } from "../store/useJobStore";
import { onAuthStateChanged } from "firebase/auth";

// ── Sign In ────────────────────────────────────────

export const signIn = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

  if (!userDoc.exists()) {
    throw new Error("User profile not found.");
  }

  return {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    ...userDoc.data(),
  };
};

// ── Sign Out ───────────────────────────────────────

export const signOut = async () => {
  await firebaseSignOut(auth);
};

// ── Sign Up ────────────────────────────────────────

const generateCompanyId = (name, uid) => {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 30);
  return `${slug}-${uid.substring(0, 6)}`;
};

export const signUp = async (name, companyName, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  const companyId = generateCompanyId(companyName, uid);

  await setDoc(doc(db, "companies", companyId), {
    name: companyName,
    ownerId: uid,
    createdAt: serverTimestamp(),
  });

  await setDoc(doc(db, "users", uid), {
    name,
    email,
    companyId,
    role: "admin",
    createdAt: serverTimestamp(),
  });

  return { uid, email, name, companyId, role: "admin" };
};

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const { setUser, setCompanyId } = useJobStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userData,
            });
            setCompanyId(userData.companyId);
          }
        } catch (e) {
          console.log("Error fetching user:", e);
        }
      } else {
        setUser(null);
        setCompanyId(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { loading };
}