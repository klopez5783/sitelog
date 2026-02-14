import { useState } from "react";
import { useRouter } from "expo-router";
import { useJobStore } from "../../../store/useJobStore";
import { createJob } from "../../../lib/firestore";

export function useJobWizard() {
  const router = useRouter();
  const { companyId, user, isDemo, setJobs, jobs } = useJobStore();

  // ── Wizard State ───────────────────────────────
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Step 1 — Job Details ───────────────────────
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // ── Step 2 — Location ─────────────────────────
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  // ── Step 3 — Dates & Crew ─────────────────────
  const [startDate, setStartDate] = useState("");
  const [estimatedCompletion, setEstimatedCompletion] = useState("");
  const [crewInput, setCrewInput] = useState("");
  const [crew, setCrew] = useState([]);

  // ── Step 4 — Client ───────────────────────────
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  // ── Helpers ───────────────────────────────────

  const getFullAddress = () => {
    return [streetAddress, city, `${state} ${zipCode}`]
      .filter(Boolean)
      .join(", ");
  };

  const addCrewMember = () => {
    const trimmed = crewInput.trim();
    if (!trimmed || crew.includes(trimmed)) {
      setCrewInput("");
      return;
    }
    setCrew([...crew, trimmed]);
    setCrewInput("");
  };

  const removeCrewMember = (memberName) => {
    setCrew(crew.filter((c) => c !== memberName));
  };

  // ── Validation ────────────────────────────────

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return name.trim().length > 0;
      case 2:
        return (
          streetAddress.trim().length > 0 &&
          city.trim().length > 0 &&
          state.trim().length > 0
        );
      case 3:
        return startDate.trim().length > 0;
      case 4:
        return clientName.trim().length > 0;
      default:
        return false;
    }
  };

  // ── Navigation ────────────────────────────────

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCompletedSteps(new Set([...completedSteps, currentStep]));
      setError("");
      setCurrentStep(currentStep + 1);
    } else {
      setError("Please fill in all required fields.");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  // ── Submission ────────────────────────────────

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    const jobData = {
      name,
      description,
      location: getFullAddress(),
      clientName,
      clientPhone,
      startDate,
      estimatedCompletion,
      assignedCrew: crew,
      createdBy: user?.uid || "demo",
      status: "active",
    };

    try {
      if (isDemo) {
        const demoJob = {
          ...jobData,
          id: `demo-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        setJobs([demoJob, ...jobs]);
      } else {
        const jobId = await createJob(companyId, jobData);
        const newJob = {
          ...jobData,
          id: jobId,
          createdAt: new Date().toISOString(),
        };
        setJobs([newJob, ...jobs]);
      }
      router.replace("/(tabs)");
    } catch (e) {
      console.log("Error creating job:", e);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Return Everything ─────────────────────────

  return {
    // Wizard
    currentStep,
    completedSteps,
    loading,
    error,
    validateStep,
    handleNext,
    handleBack,
    handleSubmit,

    // Step 1
    name, setName,
    description, setDescription,

    // Step 2
    streetAddress, setStreetAddress,
    city, setCity,
    state, setState,
    zipCode, setZipCode,

    // Step 3
    startDate, setStartDate,
    estimatedCompletion, setEstimatedCompletion,
    crewInput, setCrewInput,
    crew,
    addCrewMember,
    removeCrewMember,

    // Step 4
    clientName, setClientName,
    clientPhone, setClientPhone,

    // Helpers
    getFullAddress,
  };
}