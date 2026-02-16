import { useState, useEffect, useCallback  } from "react";
import { useFocusEffect } from "expo-router";
import { Alert } from "react-native";
import { useJobStore } from "../store/useJobStore";
import {
  getJob,
  completeJob,
  updateJob,
  getReports,
  getNotes,
  getDocuments,
} from "../lib/firestore";

export function useJobDetail(id) {
  const { companyId, isDemo, demoReports, demoNotes, jobs, setJobs } =
    useJobStore();

  const [job, setJob] = useState(null);
  const [reports, setReports] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [reactivating, setReactivating] = useState(false);

  const fetchJobData = async () => {
    try {
      if (isDemo) {
        const demoJob = jobs.find((j) => j.id === id);
        setJob(demoJob || null);
        setReports(demoReports[id] || []);
        setNotes(demoNotes[id] || []);
        setDocuments([]);
      } else {
        const [jobData, reportData, noteData, docData] = await Promise.all([
          getJob(companyId, id),
          getReports(companyId, id),
          getNotes(companyId, id),
          getDocuments(companyId, id),
        ]);
        setJob(jobData);
        setReports(reportData);
        setNotes(noteData);
        setDocuments(docData);
      }
    } catch (e) {
      console.log("Error fetching job:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    Alert.alert(
      "Complete Job",
      "Are you sure you want to mark this job as completed? You will need to reactivate it to make edits.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Complete",
          onPress: async () => {
            setCompleting(true);
            try {
              if (!isDemo) await completeJob(companyId, id);
              const updatedJob = {
                ...job,
                status: "completed",
                completedDate: new Date().toISOString(),
              };
              setJob(updatedJob);
              setJobs(jobs.map((j) => (j.id === id ? updatedJob : j)));
            } catch (e) {
              console.log("Error completing job:", e);
            } finally {
              setCompleting(false);
            }
          },
        },
      ],
    );
  };

  const handleReactivate = () => {
    Alert.alert(
      "Reactivate Job",
      "This will set the job back to active so it can be edited. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reactivate",
          onPress: async () => {
            setReactivating(true);
            try {
              if (!isDemo) {
                await updateJob(companyId, id, {
                  status: "active",
                  completedDate: null,
                });
              }
              const updatedJob = {
                ...job,
                status: "active",
                completedDate: null,
              };
              setJob(updatedJob);
              setJobs(jobs.map((j) => (j.id === id ? updatedJob : j)));
            } catch (e) {
              console.log("Error reactivating job:", e);
            } finally {
              setReactivating(false);
            }
          },
        },
      ],
    );
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchJobData();
    }, [id]),
  );

  return {
    job,
    reports,
    documents,
    notes,
    activeTab,
    setActiveTab,
    loading,
    completing,
    reactivating,
    handleComplete,
    handleReactivate,
    refetch: fetchJobData,
  };
}
