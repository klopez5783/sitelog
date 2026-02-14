import { useState } from "react";
import { useRouter } from "expo-router";
import { useJobStore } from "../store/useJobStore";
import { updateJob } from "../lib/firestore";

export function useJobEdit(job) {
  const router = useRouter();
  const { companyId, isDemo, jobs, setJobs } = useJobStore();

  // Pre-populate all fields with existing job data
  const parseLocation = (location) => {
    if (!location) return { streetAddress: "", city: "", state: "", zipCode: "" };
    const parts = location.split(",").map((p) => p.trim());
    const stateZip = (parts[2] || "").split(" ").filter(Boolean);
    return {
      streetAddress: parts[0] || "",
      city: parts[1] || "",
      state: stateZip[0] || "",
      zipCode: stateZip[1] || "",
    };
  };

  const parsed = parseLocation(job?.location);

  const [name, setName] = useState(job?.name || "");
  const [description, setDescription] = useState(job?.description || "");
  const [streetAddress, setStreetAddress] = useState(parsed.streetAddress);
  const [city, setCity] = useState(parsed.city);
  const [state, setState] = useState(parsed.state);
  const [zipCode, setZipCode] = useState(parsed.zipCode);
  const [startDate, setStartDate] = useState(job?.startDate || "");
  const [estimatedCompletion, setEstimatedCompletion] = useState(job?.estimatedCompletion || "");
  const [crewInput, setCrewInput] = useState("");
  const [crew, setCrew] = useState(job?.assignedCrew || []);
  const [clientName, setClientName] = useState(job?.clientName || "");
  const [clientPhone, setClientPhone] = useState(job?.clientPhone || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const validate = () => {
    if (!name.trim()) {
      setError("Job name is required.");
      return false;
    }
    if (!clientName.trim()) {
      setError("Client name is required.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    setError("");

    const updatedData = {
      name,
      description,
      location: getFullAddress(),
      clientName,
      clientPhone,
      startDate,
      estimatedCompletion,
      assignedCrew: crew,
    };

    try {
      if (isDemo) {
        const updatedJob = { ...job, ...updatedData };
        setJobs(jobs.map((j) => (j.id === job.id ? updatedJob : j)));
      } else {
        await updateJob(companyId, job.id, updatedData);
        setJobs(jobs.map((j) => (j.id === job.id ? { ...j, ...updatedData } : j)));
      }
      router.back();
    } catch (e) {
      console.log("Error updating job:", e);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    // Fields
    name, setName,
    description, setDescription,
    streetAddress, setStreetAddress,
    city, setCity,
    state, setState,
    zipCode, setZipCode,
    startDate, setStartDate,
    estimatedCompletion, setEstimatedCompletion,
    crewInput, setCrewInput,
    crew,
    clientName, setClientName,
    clientPhone, setClientPhone,

    // Actions
    addCrewMember,
    removeCrewMember,
    handleSave,

    // State
    loading,
    error,
  };
}