import { create } from "zustand";

const DEMO_JOBS = [
  {
    id: "demo-1",
    name: "Kitchen Remodel - Johnson Residence",
    clientName: "Mark Johnson",
    location: "4821 Oak Street, Columbus, OH",
    description: "Full kitchen remodel including cabinets, countertops, and flooring.",
    status: "active",
    startDate: "2026-02-01",
    estimatedCompletion: "2026-03-15",
    assignedCrew: ["Mike R.", "Dave S.", "Carlos M."],
    createdBy: "demo",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    name: "Roof Replacement - Sunset Plaza",
    clientName: "Sunset Plaza LLC",
    location: "900 Commerce Blvd, Columbus, OH",
    description: "Full tear-off and replacement of commercial flat roof.",
    status: "active",
    startDate: "2026-01-20",
    estimatedCompletion: "2026-02-28",
    assignedCrew: ["Tony B.", "James L."],
    createdBy: "demo",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-3",
    name: "Basement Finishing - Rivera Home",
    clientName: "Sofia Rivera",
    location: "112 Maple Ave, Dublin, OH",
    description: "Finish 1,200 sq ft basement including drywall, flooring, and bathroom.",
    status: "completed",
    startDate: "2025-11-01",
    estimatedCompletion: "2025-12-20",
    completedDate: "2025-12-18",
    assignedCrew: ["Mike R.", "Carlos M."],
    createdBy: "demo",
    createdAt: new Date().toISOString(),
  },
];

const DEMO_REPORTS = {
  "demo-1": [
    {
      id: "report-1",
      date: "2026-02-12",
      workPerformed: "Removed old cabinets and prepped walls for new installation.",
      crewOnSite: "Mike R., Dave S.",
      weather: "Clear, 42°F",
      issues: "None",
      photos: [],
      submittedBy: "Mike R.",
      submittedAt: new Date().toISOString(),
    },
    {
      id: "report-2",
      date: "2026-02-11",
      workPerformed: "Demolished existing countertops and removed flooring.",
      crewOnSite: "Mike R., Dave S., Carlos M.",
      weather: "Cloudy, 38°F",
      issues: "Found water damage behind sink area — reported to client.",
      photos: [],
      submittedBy: "Dave S.",
      submittedAt: new Date().toISOString(),
    },
  ],
  "demo-2": [
    {
      id: "report-3",
      date: "2026-02-12",
      workPerformed: "Completed tear-off on north section. Started installing underlayment.",
      crewOnSite: "Tony B., James L.",
      weather: "Windy, 35°F",
      issues: "Weather slowed progress in afternoon.",
      photos: [],
      submittedBy: "Tony B.",
      submittedAt: new Date().toISOString(),
    },
  ],
  "demo-3": [],
};

const DEMO_NOTES = {
  "demo-1": [
    {
      id: "note-1",
      content: "Client confirmed cabinet color selection — Shaker White.",
      createdBy: "Demo User",
      createdAt: new Date().toISOString(),
    },
  ],
  "demo-2": [
    {
      id: "note-2",
      content: "Permit approved by city inspector on 01/18.",
      createdBy: "Demo User",
      createdAt: new Date().toISOString(),
    },
  ],
  "demo-3": [
    {
      id: "note-3",
      content: "Final walkthrough completed. Client signed off.",
      createdBy: "Demo User",
      createdAt: new Date().toISOString(),
    },
  ],
};

export const useJobStore = create((set) => ({
  jobs: [],
  activeJob: null,
  isDemo: false,
  demoReports: DEMO_REPORTS,
  demoNotes: DEMO_NOTES,

  setJobs: (jobs) => set({ jobs }),
  setActiveJob: (job) => set({ activeJob: job }),

  enterDemo: () => set({
    isDemo: true,
    jobs: DEMO_JOBS,
  }),

  exitDemo: () => set({
    isDemo: false,
    jobs: [],
    activeJob: null,
  }),
}));