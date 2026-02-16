import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useJobStore } from "../store/useJobStore";
import { addNote } from "../lib/firestore";

export function useAddNote() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams();
  const { companyId, isDemo, user } = useJobStore();

  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!content.trim()) return "Please enter a note.";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        content: content.trim(),
        createdBy: user?.name || "Unknown",
        createdAt: new Date().toISOString(),
      };

      if (!isDemo) {
        await addNote(companyId, jobId, payload);
      }

      router.back();
    } catch (e) {
      console.log("Error adding note:", e);
      setError("Failed to save note. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    jobId,
    content,
    setContent,
    submitting,
    error,
    handleSubmit,
  };
}