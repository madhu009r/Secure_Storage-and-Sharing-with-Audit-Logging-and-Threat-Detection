import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../api/axios";

const PublicShare = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const[password, setPassword] = useState("");

  // useEffect(() => {
  //   downloadFile();
  // }, []);



const downloadFile = async () => {
  try {
    const res = await apiClient.get(
      `/share/${token}?password=${password}`,
      { responseType: "blob" }
    );

    const blob = new Blob([res.data], {
      type: res.headers["content-type"],
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "file";
    a.click();

  } catch (err) {
    alert("Wrong password or expired link ❌");
  }
};

  return (
    //input for password if required, otherwise show downloading message
   <div className="flex flex-col items-center justify-center h-screen">

  <h2 className="text-xl font-semibold mb-4">
    Secure File Download 🔐
  </h2>

  <input
    type="password"
    placeholder="Enter password (if required)"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="border px-4 py-2 rounded mb-4"
  />

  <button
    onClick={downloadFile}
    className="bg-blue-600 text-white px-6 py-2 rounded"
  >
    Download File
  </button>

</div>
  );
};

export default PublicShare;