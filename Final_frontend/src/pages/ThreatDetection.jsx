import { useState, useEffect } from 'react';
import { Shield, RefreshCw, AlertTriangle } from 'lucide-react';
import apiClient from '../api/axios';
import ThreatList from '../components/threat/ThreatList';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/common/Toast';

const ThreatDetection = () => {
  const [threats, setThreats] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const toast = useToast();

  useEffect(() => {
    fetchThreats();
    const interval = setInterval(fetchThreats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchThreats = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/threats');
      const threatsData = response.data.alerts || response.data;
      setThreats(threatsData);

      const statsData = {
        total: threatsData.length,
        critical: threatsData.filter((t) => t.riskScore >= 80).length,
        high: threatsData.filter((t) => t.riskScore >= 60 && t.riskScore < 80).length,
        medium: threatsData.filter((t) => t.riskScore >= 30 && t.riskScore < 60).length,
        low: threatsData.filter((t) => t.riskScore < 30).length,
      };
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load threat data');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredThreats = () => {
    if (filter === 'all') return threats;
    if (filter === 'critical') return threats.filter((t) => t.riskScore >= 80);
    if (filter === 'high') return threats.filter((t) => t.riskScore >= 60 && t.riskScore < 80);
    if (filter === 'medium') return threats.filter((t) => t.riskScore >= 30 && t.riskScore < 60);
    if (filter === 'low') return threats.filter((t) => t.riskScore < 30);
    return threats;
  };

  const statCards = [
    { label: 'Total Threats', value: stats.total, color: 'bg-gray-500' },
    { label: 'Critical', value: stats.critical, color: 'bg-red-500' },
    { label: 'High', value: stats.high, color: 'bg-orange-500' },
    { label: 'Medium', value: stats.medium, color: 'bg-yellow-500' },
    { label: 'Low', value: stats.low, color: 'bg-green-500' },
  ];

  return (
    <div className="p-8">
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="w-8 h-8" />
            Threat Detection
          </h1>
          <p className="text-gray-600 mt-2">
            Real-time file security monitoring and threat analysis
          </p>
        </div>
        <button
          onClick={fetchThreats}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className="w-5 h-5" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-gray-600 mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold">Filter by Severity</h2>
        </div>
        <div className="flex gap-2">
          {['all', 'critical', 'high', 'medium', 'low'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <ThreatList threats={getFilteredThreats()} loading={loading} />
      </div>
    </div>
  );
};

export default ThreatDetection;
