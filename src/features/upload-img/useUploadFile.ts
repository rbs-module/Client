import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export function useUploadFile() {
  const [loading, setLoading] = useState(false);

  const upload = async (file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      formData.append("upload_preset", "rqys3beg");
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dbu76a0wo/image/upload`,
        formData,
      );
      if (res.status == 200) {
        toast.success("File Upload Success");
        return res.data.secure_url;
      } else {
        return toast.error("File Upload Failed");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return { upload, loading };
}
