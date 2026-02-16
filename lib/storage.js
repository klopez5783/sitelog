import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { storage } from "./firebase";

// Converts any format (HEIC, HEIF, PNG, etc.) to a JPEG blob
const toJpegBlob = async (uri) => {
  // Re-save as JPEG — handles HEIC, HEIF, PNG, whatever the camera shot
  const result = await manipulateAsync(
    uri,
    [], // no resize/crop transforms
    { compress: 0.8, format: SaveFormat.JPEG }
  );

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(new Error("Failed to convert URI to blob"));
    xhr.responseType = "blob";
    xhr.open("GET", result.uri, true);
    xhr.send(null);
  });
};

export const uploadReportPhoto = async (companyId, jobId, uri) => {
  const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
  const path = `companies/${companyId}/jobs/${jobId}/reports/${filename}`;
  const storageRef = ref(storage, path);

  try {
    const blob = await toJpegBlob(uri);
    console.log("Blob size:", blob.size, "type:", blob.type); // should now say image/jpeg

    const snapshot = await uploadBytes(storageRef, blob, { contentType: "image/jpeg" });
    blob.close?.();
    return await getDownloadURL(snapshot.ref);

  } catch (e) {
    console.log("Storage error code:", e.code);
    console.log("Storage error message:", e.message);
    console.log("Storage error details:", e.serverResponse);
    console.error("Error:" , e)
    throw e;
  }
};