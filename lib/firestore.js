import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ── Jobs ──────────────────────────────────────────

export const getJobs = async (companyId) => {
  const q = query(
    collection(db, "companies", companyId, "jobs"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getJob = async (companyId, jobId) => {
  const snap = await getDoc(doc(db, "companies", companyId, "jobs", jobId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const createJob = async (companyId, data) => {
  const ref = await addDoc(collection(db, "companies", companyId, "jobs"), {
    ...data,
    status: "active",
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateJob = async (companyId, jobId, data) => {
  await updateDoc(doc(db, "companies", companyId, "jobs", jobId), data);
};

export const completeJob = async (companyId, jobId) => {
  await updateDoc(doc(db, "companies", companyId, "jobs", jobId), {
    status: "completed",
    completedDate: serverTimestamp(),
  });
};

// ── Reports ───────────────────────────────────────

export const getReports = async (companyId, jobId) => {
  const q = query(
    collection(db, "companies", companyId, "jobs", jobId, "reports"),
    orderBy("submittedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addReport = async (companyId, jobId, data) => {
  const ref = await addDoc(
    collection(db, "companies", companyId, "jobs", jobId, "reports"),
    { ...data, submittedAt: serverTimestamp() }
  );
  return ref.id;
};

// ── Documents ─────────────────────────────────────

export const getDocuments = async (companyId, jobId) => {
  const snapshot = await getDocs(
    collection(db, "companies", companyId, "jobs", jobId, "documents")
  );
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addDocument = async (companyId, jobId, data) => {
  const ref = await addDoc(
    collection(db, "companies", companyId, "jobs", jobId, "documents"),
    { ...data, uploadedAt: serverTimestamp() }
  );
  return ref.id;
};

// ── Notes ─────────────────────────────────────────

export const getNotes = async (companyId, jobId) => {
  const q = query(
    collection(db, "companies", companyId, "jobs", jobId, "notes"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addNote = async (companyId, jobId, data) => {
  const ref = await addDoc(
    collection(db, "companies", companyId, "jobs", jobId, "notes"),
    { ...data, createdAt: serverTimestamp() }
  );
  return ref.id;
};