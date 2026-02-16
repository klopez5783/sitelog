import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { useJobStore } from "../store/useJobStore";
import { addDocument } from "../lib/firestore";
import { uploadDocumentFile } from "../lib/storage";

const CATEGORIES = [
  { id: "contracts", name: "Contracts", emoji: "📝" },
  { id: "permits",   name: "Permits",   emoji: "🏛️" },
  { id: "plans",     name: "Plans",     emoji: "📐" },
  { id: "photos",    name: "Photos",    emoji: "📸" },
];

export function useAddDocument() {
  const router = useRouter();
  const { jobId, category: preselectedCategory } = useLocalSearchParams();
  const { companyId, isDemo, user } = useJobStore();

  const [selectedCategory, setSelectedCategory] = useState(preselectedCategory || null);
  const [pickedFile, setPickedFile] = useState(null); // { name, uri, mimeType, size, isImage }
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");

  // ── Auto-fill name from filename ──────────────────────
  const applyFileName = (filename) => {
    if (!name) {
      setName(filename.replace(/\.[^/.]+$/, ""));
    }
  };

  // ── Pick from file system ─────────────────────────────
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const file = result.assets[0];
      setPickedFile({ name: file.name, uri: file.uri, mimeType: file.mimeType, size: file.size, isImage: false });
      applyFileName(file.name);
    } catch (e) {
      setError("Failed to pick file.");
    }
  };

  // ── Pick from photo library ───────────────────────────
  const pickFromLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        setError("Photo library permission is required.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      const filename = `photo_${Date.now()}.jpg`;
      setPickedFile({ name: filename, uri: asset.uri, mimeType: "image/jpeg", size: asset.fileSize, isImage: true });
      applyFileName(filename);
    } catch (e) {
      setError("Failed to pick photo.");
    }
  };

  // ── Take photo with camera ────────────────────────────
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        setError("Camera permission is required.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ quality: 1 });
      if (result.canceled) return;
      const asset = result.assets[0];
      const filename = `photo_${Date.now()}.jpg`;
      setPickedFile({ name: filename, uri: asset.uri, mimeType: "image/jpeg", size: asset.fileSize, isImage: true });
      applyFileName(filename);
    } catch (e) {
      setError("Failed to take photo.");
    }
  };

  const clearFile = () => {
    setPickedFile(null);
    setName("");
  };

  const validate = () => {
    if (!pickedFile)         return "Please select a file.";
    if (!selectedCategory)   return "Please select a category.";
    if (!name.trim())        return "Please enter a document name.";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setSubmitting(true);
    setError("");

    try {
      let uri = pickedFile.uri;
      let mimeType = pickedFile.mimeType;

      // Convert any image to JPEG (handles HEIC, PNG, etc.)
      if (pickedFile.isImage) {
        const converted = await manipulateAsync(uri, [], {
          compress: 0.8,
          format: SaveFormat.JPEG,
        });
        uri = converted.uri;
        mimeType = "image/jpeg";
      }

      let downloadUrl = "";
      let storagePath = "";

      if (!isDemo) {
        const result = await uploadDocumentFile(
          companyId, jobId, uri, pickedFile.name, mimeType
        );
        downloadUrl = result.downloadUrl;
        storagePath = result.storagePath;
      }

      const payload = {
        name: name.trim(),
        category: selectedCategory,
        fileName: pickedFile.name,
        fileSize: pickedFile.size,
        mimeType,
        downloadUrl,
        storagePath,
        uploadedBy: user?.name || "Unknown",
        uploadedAt: new Date().toISOString(),
      };

      if (!isDemo) await addDocument(companyId, jobId, payload);
      router.back();

    } catch (e) {
      console.log("Error adding document:", e);
      setError("Failed to save document. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    jobId,
    CATEGORIES,
    selectedCategory,
    setSelectedCategory,
    pickedFile,
    pickDocument,
    pickFromLibrary,
    takePhoto,
    clearFile,
    name,
    setName,
    submitting,
    error,
    handleSubmit,
    description,
    setDescription,
  };
}