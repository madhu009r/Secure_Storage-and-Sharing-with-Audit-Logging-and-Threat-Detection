import { FileText, Download, Share2, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from '../utils/dateUtils';

const FileCard = ({ file, onDownload, onShare, onDelete }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate" title={file.name}>
            {file.name}
          </h3>

          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{formatDistanceToNow(file.uploadedAt)}</span>
          </div>

          <div className="mt-2 text-sm text-gray-600">
            <span className="font-medium">Size:</span> {(file.size / 1024 / 1024).toFixed(2)} MB
          </div>

          {file.sha256Hash && (
            <div className="mt-1 text-xs text-gray-500 font-mono truncate" title={file.sha256Hash}>
              {file.sha256Hash.substring(0, 24)}...
            </div>
          )}

          {file.threatScore > 0 && (
            <div className="mt-2">
              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                Threat: {file.threatScore}%
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t">
        <button
          onClick={() => onDownload(file)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
        <button
          onClick={() => onShare(file)}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(file)}
          className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FileCard;
