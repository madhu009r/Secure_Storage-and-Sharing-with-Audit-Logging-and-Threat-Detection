import { useState, useEffect } from 'react';
import { FileText, Shield, Share2, AlertTriangle } from 'lucide-react';
import apiClient from '../api/axios';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/common/Toast';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    sharedFiles: 0,
    threats: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

 const fetchDashboardData = async () => {
  try {
    const response = await apiClient.get('/dashboard/summary');
    const activityResponse = await apiClient.get('/dashboard/activity');
    


    setStats({
      totalFiles: response.data.totalFiles,
      totalSize: response.data.storageUsed,
      sharedFiles: response.data.sharedFiles,
      threats: response.data.threatAlerts,
      recentActivity: activityResponse.data
    });

  } catch (error) {
    toast.error('Failed to load dashboard data');
  } finally {
    setLoading(false);
  }
};


const formatBytes = (bytes) => {
  if (!bytes) return "0 Bytes";

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
};

  const statCards = [
    {
      title: 'Total Files',
      value: stats.totalFiles,
      icon: FileText,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Storage Used',
      value: formatBytes(stats.totalSize),
      icon: FileText,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Shared Files',
      value: stats.sharedFiles,
      icon: Share2,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Threat Alerts',
      value: stats.threats,
      icon: stats.threats > 0 ? AlertTriangle : Shield,
      color: stats.threats > 0 ? 'bg-red-500' : 'bg-green-500',
      bgColor: stats.threats > 0 ? 'bg-red-50' : 'bg-green-50',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2"> Welcome back, <span className="font-semibold">{user?.username}</span><b>🫡!.</b>
         Here's your storage overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className={`${card.bgColor} rounded-xl p-6 border border-gray-200`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{card.title}</p>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {stats.recentActivity && stats.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {stats.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b last:border-b-0"
              >
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.resource}</p>
                </div>
                <p className="text-sm text-gray-400">{new Date(activity.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
