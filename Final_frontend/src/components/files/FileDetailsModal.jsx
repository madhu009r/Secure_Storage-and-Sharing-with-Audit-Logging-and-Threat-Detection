import { X } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

const FileDetailsModal = ({ isOpen, onClose, file }) => {
  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">File Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">File Name</label>
              <p className="mt-1 text-gray-900">{file.name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">File Size</label>
              <p className="mt-1 text-gray-900">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">MIME Type</label>
              <p className="mt-1 text-gray-900">{file.mimeType || 'Unknown'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Version</label>
              <p className="mt-1 text-gray-900">v{file.version || 1}</p>
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-500">SHA-256 Hash</label>
              <p className="mt-1 text-gray-900 font-mono text-sm break-all bg-gray-50 p-2 rounded">
                {file.sha256Hash}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Uploaded At</label>
              <p className="mt-1 text-gray-900">{formatDate(file.uploadedAt)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Last Modified</label>
              <p className="mt-1 text-gray-900">{formatDate(file.updatedAt)}</p>
            </div>

            {file.blockchainTxHash && (
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-500">
                  Blockchain Transaction Hash
                </label>
                <p className="mt-1 text-gray-900 font-mono text-sm break-all bg-blue-50 p-2 rounded border border-blue-200">
                  {file.blockchainTxHash}
                </p>
              </div>
            )}

            {file.threatScore !== undefined && (
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-500">Threat Score</label>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        file.threatScore < 30
                          ? 'bg-green-500'
                          : file.threatScore < 70
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${file.threatScore}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{file.threatScore}%</span>
                </div>
              </div>
            )}

            {file.downloadCount !== undefined && (
              <div>
                <label className="text-sm font-medium text-gray-500">Downloads</label>
                <p className="mt-1 text-gray-900">{file.downloadCount}</p>
              </div>
            )}

            {file.shareCount !== undefined && (
              <div>
                <label className="text-sm font-medium text-gray-500">Shares</label>
                <p className="mt-1 text-gray-900">{file.shareCount}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileDetailsModal;
