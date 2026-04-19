import { ExternalLink, FileText, Download, Share2, Trash2, Shield } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

const AuditTable = ({ logs, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No audit logs found</p>
      </div>
    );
  }

  // const action = logs.action?.toLowerCase();

  const getActionIcon = (action) => {
    switch (action) {
      case 'upload':
        return <FileText className="w-4 h-4" />;
      case 'download':
        return <Download className="w-4 h-4" />;
      case 'share':
        return <Share2 className="w-4 h-4" />;
      case 'delete':
        return <Trash2 className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'upload':
        return 'bg-blue-100 text-blue-800';
      case 'download':
        return 'bg-green-100 text-green-800';
      case 'share':
        return 'bg-purple-100 text-purple-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resource
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Blockchain TX
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timestamp
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              IP Address
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => {
  const action = log.action?.toLowerCase();

  return (
    <tr key={log.id} className="hover:bg-gray-50">

      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getActionColor(action)}`}>
          {getActionIcon(action)}
          {log.action}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {log.userId}
      </td>

      <td className="px-6 py-4 text-sm text-gray-500">
        <span title={log.fileHash}>
          {log.fileHash?.substring(0, 20)}...
        </span>
      </td>

      <td className="px-6 py-4 text-sm">
        {log.blockchainTx ? (
          <a
            href={`https://etherscan.io/tx/${log.blockchainTx}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 font-mono"
          >
            {log.blockchainTx.substring(0, 12)}...
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-yellow-600 text-xs">Pending</span>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(log.timestamp)}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
        {log.ipAddress || 'N/A'}
      </td>

    </tr>
  );
})}
        </tbody>
      </table>
    </div>
  );
};

export default AuditTable;
