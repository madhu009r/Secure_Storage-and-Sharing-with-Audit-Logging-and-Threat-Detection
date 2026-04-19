import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import apiClient from "../api/axios";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/common/Toast";
import { Share2 } from "lucide-react";

const MyFiles = () => {
  console.log("MyFiles component rendered");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
 const [showShareModal, setShowShareModal] = useState(false);
const [selectedFileId, setSelectedFileId] = useState(null);
const [password, setPassword] = useState("");
const [expiry, setExpiry] = useState(1440); // default 1 day

  useEffect(() => {
     console.log("useEffect triggered");
    fetchFiles();
  }, []);

const fetchFiles = async () => {
  console.log("Fetching files...");

  try {
    const response = await apiClient.get("files/my");
    console.log("FILES RESPONSE:", response.data);

    setFiles(response.data);
  }

  // } catch (error) {
  //   console.log("ERROR RESPONSE:", error.response);
  //   toast.error("Failed to load files");
  // }
  catch (error) {
  console.log("FULL ERROR:", error);
  console.log("ERROR RESPONSE:", error.response);
  console.log("ERROR MESSAGE:", error.message);
} 
  finally {
    setLoading(false);
  }
};

  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file); // MUST match @RequestParam("file")

  try {
    const response = await apiClient.post(
      "/files/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    toast.success("File uploaded successfully");

    fetchFiles(); // refresh list

  } catch (error) {
    console.error(error);
    toast.error("Upload failed");
  }
};



const handleCreateShare = async () => {
  try {
    const res = await apiClient.post(
      `/files/${selectedFileId}/share`,
      null,
      {
        params: {
          password: password,
          minutesValid: expiry
        }
      }
    );

    alert("Link: " + res.data.link);

    setShowShareModal(false);
    setPassword("");
    setExpiry(1440);

  } catch (err) {
    console.error(err);
    alert("Failed to create link");
  }
};


   const handleDownload = async (fileId, fileName) => {
  try {
    const res = await apiClient.get(`/files/${fileId}/download`, {
      responseType: "blob",
    });

    const blob = new Blob([res.data]); // ✅ important
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "file";
    document.body.appendChild(a);
    a.click();
    a.remove();

  } catch (err) {
    console.error(err);
    alert("Download failed");
  }
};


  const handlePreview = async (fileId) => {
  try {
    const res = await apiClient.get(`/files/${fileId}/preview`, {
      responseType: "blob",
    });

    const fileURL = URL.createObjectURL(res.data);
    window.open(fileURL);
  } catch (err) {
    console.error(err);
    alert("Preview failed");
  }
};

  const formatBytes = (bytes) => {
    if (!bytes) return "0 Bytes";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  };

  const handleShare = async (fileId) => {
  try {
    const res = await apiClient.post(
  `/files/${fileId}/share`,
  null,
  {
    params: {
      password: password,          // 🔐 ADD THIS
      minutesValid: 1440,
      maxDownloads: 10
    }
  }
);
    const link = `${window.location.origin}/share/${res.data.token}`;

    await navigator.clipboard.writeText(link);
    toast.success("Share link copied 🚀");
  } catch {
    toast.error("Failed to share");
  }
};

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (

    



    <div className="p-8">
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Files</h1>

        <button
          onClick={handleUploadClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Upload size={18} />
          Upload Files
        </button>

        <input
          id="fileInput"
          type="file"
          hidden
          onChange={handleFileUpload}
        />
      </div>

      {files.length === 0 ? (
        <div className="bg-white p-10 rounded-xl border text-center text-gray-500">
          No files found
        </div>
      ) : (
        <div className="bg-white rounded-xl border">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left p-4">File Name</th>
                <th className="text-left p-4">Size</th>
                <th className="text-left p-4">Uploaded</th>
                <th className="text-left p-4">Actions</th>
                <th className="text-left p-4">Preview</th>
                {/* <th className="text-left p-4">Blockchain</th> */}
                <th className="text-left p-4">Share</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{file.originalFileName}</td>
                  <td className="p-4">{formatBytes(file.size)}</td>
                  <td className="p-4">
                    {new Date(file.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDownload(file.id, file.originalFileName)}
                      className="text-blue-600 hover:underline"
                    >
                      Download
                    </button>
                  </td>
                  <td className="p-4">
                       <button
                    onClick={() =>  handlePreview(file.id)}
                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Open
                  </button>
                  </td>
                   {/* <td className="p-4">
                    {file.blockchainVerified ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        Verified
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                        Pending
                      </span>
                    )}
                  </td> */}
                  <td>
                        <button
                            onClick={() => {
                                    setSelectedFileId(file.id);
                                    setShowShareModal(true);
                                  }}
                          className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showShareModal && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        
        <div className="bg-white p-6 rounded-xl shadow-lg w-96">

          <h2 className="text-lg font-semibold mb-4">
            Create Share Link 🔐
          </h2>

          {/* Password */}
          <input
            type="password"
            placeholder="Set password (optional)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-3"
          />

          {/* Expiry */}
          <input
            type="number"
            placeholder="Expiry (minutes)"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4"
          />

          <div className="flex justify-end gap-3">
            
            <button
              onClick={() => {
                setShowShareModal(false);
                setPassword("");
                setExpiry("");
              }}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              onClick={handleCreateShare}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Create Link
            </button>

          </div>
        </div>
      </div>
    )}
    {/* ✅ MODAL ENDS HERE */}
    </div>

    
  );
};

export default MyFiles;