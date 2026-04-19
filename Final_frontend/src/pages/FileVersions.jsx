import { useState, useEffect } from 'react';
import { Clock, Download, FileText } from 'lucide-react';
import apiClient from '../api/axios';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/common/Toast';
import { formatDate } from '../components/utils/dateUtils';

const FileVersions = () => {
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState('');
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await apiClient.get('/files/my');
      setFiles(response.data.files || response.data);
    } catch (error) {
      toast.error('Failed to load files');
    }
  };

  const fetchVersions = async (fileId) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/file_versions?fileId=${fileId}`);
      setVersions(response.data.versions || response.data);
    } catch (error) {
      toast.error('Failed to load file versions');
      setVersions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (fileId) => {
    setSelectedFileId(fileId);
    if (fileId) {
      fetchVersions(fileId);
    } else {
      setVersions([]);
    }
  };

  const handleDownloadVersion = async (version) => {
    try {
      const response = await apiClient.get(`/files/${version.id}/download`, {
        responseType: 'arraybuffer',
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = version.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Version downloaded successfully');
    } catch (error) {
      toast.error('Failed to download version');
    }
  };

  return (
    <div className="p-8">
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">File Versions</h1>
        <p className="text-gray-600 mt-2">View and manage file version history</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select a file to view versions
        </label>
        <select
          value={selectedFileId}
          onChange={(e) => handleFileSelect(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">-- Select a file --</option>
          {files.map((file) => (
            <option key={file.id} value={file.id}>
              {file.name}
            </option>
          ))}
        </select>
      </div>

      {selectedFileId && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Version History
            </h2>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : versions.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No version history available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          v{version.version}
                        </span>
                        <span className="text-sm text-gray-600">
                          {formatDate(version.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">File:</span> {version.fileName}
                      </p>
                      <p className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">Size:</span>{' '}
                        {(version.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        <span className="font-medium">SHA-256:</span>{' '}
                        {version.sha256Hash?.substring(0, 32)}...
                      </p>
                      {version.blockchainTxHash && (
                        <p className="text-xs text-blue-600 font-mono mt-1">
                          <span className="font-medium">TX Hash:</span>{' '}
                          {version.blockchainTxHash.substring(0, 32)}...
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDownloadVersion(version)}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileVersions;
