import { AlertTriangle, Shield, XCircle } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

const ThreatList = ({ threats, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (threats.length === 0) {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <p className="text-gray-500">No threats detected</p>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
  switch (severity) {
    case "CRITICAL":
      return "border-red-500 bg-red-50";
    case "HIGH":
      return "border-orange-500 bg-orange-50";
    case "MEDIUM":
      return "border-yellow-500 bg-yellow-50";
    default:
      return "border-green-500 bg-green-50";
  }
};

  const getSeverityIcon = (severity) => {
  switch (severity) {
    case "CRITICAL":
      return "🔴";
    case "HIGH":
      return "🟠";
    case "MEDIUM":
      return "🟡";
    default:
      return "🟢";
  }
};

  return (
    <div className="space-y-4">
      {(threats || []).map((threat) => (
  <div
    key={threat.id}
    className={`border rounded-lg p-4 ${getSeverityColor(threat.severity)}`}
  >
    <div className="flex items-start gap-4">
      
      <div className="mt-1">
        {getSeverityIcon(threat.severity)}
      </div>

      <div className="flex-1">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">
            {threat.user}
          </h3>

          <span className="px-3 py-1 rounded-full text-sm font-medium bg-white">
            {threat.severity}
          </span>
        </div>

        {/* REASON */}
        <p className="text-sm mb-3">
          {threat.reason}
        </p>

        {/* DETAILS */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          
          <div>
            <span className="font-medium">IP Address:</span>
            <p>{threat.ipAddress}</p>
          </div>

          <div>
            <span className="font-medium">Risk Score:</span>
            <p>{Math.round(threat.riskScore * 100)}%</p>
          </div>

          <div>
            <span className="font-medium">Detected:</span>
            <p>{formatDate(threat.timestamp)}</p>
          </div>

        </div>

      </div>
    </div>
  </div>
))}
    </div>
  );
};

export default ThreatList;
