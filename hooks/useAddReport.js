import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useJobStore } from "../store/useJobStore";
import { getJob, addReport } from "../lib/firestore";
import { uploadReportPhoto } from "../lib/storage";

const today = () => new Date().toISOString().split("T")[0];

export function useAddReport(jobId) {
  const router = useRouter();
  const { companyId, isDemo, user, jobs } = useJobStore();

  const [form, setForm] = useState({
    date: today(),
    weather: "",
    workPerformed: "",
    issues: "",
  });

  // ── Crew state ────────────────────────────────
  const [assignedCrew, setAssignedCrew] = useState([]);   // from job doc
  const [selectedCrew, setSelectedCrew] = useState([]);   // chip selections
  const [extraCrew, setExtraCrew] = useState("");         // free-text additions

  // ── Image state ───────────────────────────────
  const [images, setImages] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // ── Load crew from job ────────────────────────
  useEffect(() => {
    const loadCrew = async () => {
      // Try the Zustand store first (already in memory)
      const cached = jobs?.find((j) => j.id === jobId);
      if (cached?.assignedCrew?.length) {
        setAssignedCrew(cached.assignedCrew);
        return;
      }
      // Fallback: fetch from Firestore
      try {
        if (!isDemo) {
          const job = await getJob(companyId, jobId);
          if (job?.assignedCrew?.length) {
            setAssignedCrew(job.assignedCrew);
          }
        }
      } catch (e) {
        console.warn("Could not load crew:", e);
      }
    };
    loadCrew();
  }, [jobId]);

  // ── Crew toggle ───────────────────────────────
  const toggleCrewMember = (member) => {
    setSelectedCrew((prev) =>
      prev.includes(member) ? prev.filter((m) => m !== member) : [...prev, member]
    );
  };

  // Build the final crewOnSite string
  const buildCrewOnSite = () => {
    const all = [
      ...selectedCrew,
      ...(extraCrew.trim() ? [extraCrew.trim()] : []),
    ];
    return all.join(", ");
  };

  // ── Form fields ───────────────────────────────
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ── Image picker ──────────────────────────────
  const pickFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setError("Photo library access is required to add images.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setError("Camera access is required to take photos.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (uri) => {
    setImages((prev) => prev.filter((i) => i !== uri));
  };

  // ── Submit ────────────────────────────────────
  const validate = () => {
    if (!form.date.trim()) return "Date is required.";
    if (!form.workPerformed.trim()) return "Work performed is required.";
    const crew = buildCrewOnSite();
    if (!crew) return "Select at least one crew member or enter a name.";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      let photoUrls = [];
      if (!isDemo && images.length > 0) {
        photoUrls = await Promise.all(
          images.map((uri) => uploadReportPhoto(companyId, jobId, uri))
        );
      }

      const payload = {
        ...form,
        crewOnSite: buildCrewOnSite(),
        issues: form.issues.trim() || "None",
        submittedBy: user?.name || "Admin",
        photos: photoUrls,
      };

      if (!isDemo) {
        await addReport(companyId, jobId, payload);
      }

      router.back();
    } catch (e) {
      setError("Failed to save report. Please try again.");
      console.error("Error adding report:", e);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    updateField,
    assignedCrew,
    selectedCrew,
    toggleCrewMember,
    extraCrew,
    setExtraCrew,
    images,
    pickFromLibrary,
    takePhoto,
    removeImage,
    submitting,
    error,
    handleSubmit,
  };
}