import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export const uploadReportPhoto = async (companyId, jobId, uri) => {
  const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
  const path = `companies/${companyId}/jobs/${jobId}/reports/${filename}`;
  const storageRef = ref(storage, path);

  const response = await fetch(uri);
  const blob = await response.blob();

  const snapshot = await uploadBytes(storageRef, blob, { contentType: "image/jpeg" });
  return await getDownloadURL(snapshot.ref);
};