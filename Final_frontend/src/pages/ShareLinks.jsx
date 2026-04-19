import { useState, useEffect } from 'react';
import { Link2, Copy, Check, Trash2, ExternalLink, RefreshCw } from 'lucide-react';
import apiClient from '../api/axios';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/common/Toast';
import { formatDate } from '../components/utils/dateUtils';

const ShareLinks = () => {
  const [shareLinks, setShareLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [password, setPassword] = useState(""); // 🔐 NEW STATE FOR PASSWORD
  const toast = useToast();

  useEffect(() => {
    fetchShareLinks();
  }, []);

  const fetchShareLinks = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/files/shares');
      setShareLinks(response.data || []);
    } catch (error) {
      toast.error('Failed to load share links');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (link, id) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(id);
      toast.success('Link copied 🚀');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Copy failed');
    }
  };

  const handleDelete = async (token) => {
    if (!window.confirm('Are you sure you want to revoke this share link?')) return;

    try {
      await apiClient.post(`/files/shares/${token}/revoke`);
      toast.success('Share link revoked');
      fetchShareLinks();
    } catch {
      toast.error('Failed to revoke');
    }
  };

  const getStatus = (expiresAt, usageCount, maxDownloads, revoked) => {
    if (revoked) return 'Revoked';

    const isExpired = new Date(expiresAt) < new Date();
    const isMaxed = maxDownloads && usageCount >= maxDownloads;

    if (isExpired) return 'Expired';
    if (isMaxed) return 'Max Downloads Reached';
    return 'Active';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Revoked':
        return 'bg-gray-200 text-gray-700';
      case 'Max Downloads Reached':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-8">
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />

      {/* HEADER */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Share Links</h1>
          <p className="text-gray-600 mt-2">
            Manage your secure file sharing links
          </p>
        </div>

        <button
          onClick={fetchShareLinks}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
          </div>
        ) : shareLinks.length === 0 ? (
          <div className="text-center py-12">
            <Link2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No share links created yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Go to My Files and click Share
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {shareLinks.map((share) => {
              const fullLink = `${window.location.origin}/share/${share.token}`;

              const usageCount = share.usedDownloads || 0;
              const maxDownloads = share.maxDownloads;

              const status = getStatus(
                share.expiresAt,
                usageCount,
                maxDownloads,
                share.revoked
              );

              return (
                <div key={share.id} className="p-6 hover:bg-gray-50">
                  {/* TOP SECTION */}
                  <div className="flex justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        📄 {share.fileName || 'Unknown File'}
                      </h3>

                      <span
                        className={`px-2 py-1 text-xs rounded ${getStatusColor(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(share.token)}
                      disabled={status !== 'Active'}
                      className={`${
                        status !== 'Active'
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-red-600 hover:text-red-800'
                      }`}
                      title="Revoke link"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* LINK BOX */}
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={fullLink}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border rounded text-sm font-mono"
                      />

                      <button
                        onClick={() => copyToClipboard(fullLink, share.id)}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        {copiedId === share.id ? (
                          <>
                            <Check className="w-4 h-4 inline" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 inline" /> Copy
                          </>
                        )}
                      </button>

                      <a
                        href={fullLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* META INFO */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <p className="font-medium">
                        {formatDate(share.createdAt)}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500">Expires:</span>
                      <p className="font-medium">
                        {formatDate(share.expiresAt)}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500">Usage:</span>
                      <p className="font-medium">
                        {usageCount} / {maxDownloads || '∞'}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500">Token:</span>
                      <p className="font-mono text-xs truncate">
                        {share.token?.substring(0, 12)}...
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareLinks;