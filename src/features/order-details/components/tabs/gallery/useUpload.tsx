import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export function useUploadFiles() {
  const [loading, setLoading] = useState(false);

  const uploadMultiple = async (files: File[]) => {
    try {
      setLoading(true);
      const urls: string[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "rqys3beg");

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/dbu76a0wo/image/upload`,
          formData,
        );

        if (res.status === 200) {
          urls.push(res.data.secure_url);
        } else {
          toast.error(`Upload failed for ${file.name}`);
        }
      }

      if (urls.length) toast.success("Files uploaded successfully");
      return urls;
    } catch (error) {
      console.error(error);
      toast.error("File upload failed");
    } finally {
      setLoading(false);
    }
  };

  return { uploadMultiple, loading };
}
