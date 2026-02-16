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
  try {
    const q = query(
      collection(db, "companies", companyId, "jobs"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    // Fallback without orderBy if index doesn't exist yet
    const snapshot = await getDocs(
      collection(db, "companies", companyId, "jobs")
    );
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
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
  const ref = collection(
    db,
    "companies", companyId,
    "jobs", jobId,
    "documents"
  );
  const snap = await addDoc(ref, {
    ...data,
    uploadedAt: serverTimestamp(),
  });
  return snap.id;
};

export const deleteDocument = async (companyId, jobId, documentId) => {
  await deleteDoc(
    doc(db, "companies", companyId, "jobs", jobId, "documents", documentId)
  );
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
  const ref = collection(db, "companies", companyId, "jobs", jobId, "notes");
  const snap = await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return snap.id;
};

export const getReport = async (companyId, jobId, reportId) => {
  const snap = await getDoc(
    doc(db, "companies", companyId, "jobs", jobId, "reports", reportId)
  );
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const deleteReport = async (companyId, jobId, reportId) => {
  await deleteDoc(
    doc(db, "companies", companyId, "jobs", jobId, "reports", reportId)
  );
};

export const getDocument = async (companyId, jobId, documentId) => {
  const snap = await getDoc(
    doc(db, "companies", companyId, "jobs", jobId, "documents", documentId)
  );
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};


export const getNote = async (companyId, jobId, noteId) => {
  const snap = await getDoc(
    doc(db, "companies", companyId, "jobs", jobId, "notes", noteId)
  );
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const updateNote = async (companyId, jobId, noteId, data) => {
  await updateDoc(
    doc(db, "companies", companyId, "jobs", jobId, "notes", noteId),
    {
      ...data,
      updatedAt: serverTimestamp(),
    }
  );
};

export const deleteNote = async (companyId, jobId, noteId) => {
  await deleteDoc(
    doc(db, "companies", companyId, "jobs", jobId, "notes", noteId)
  );
};