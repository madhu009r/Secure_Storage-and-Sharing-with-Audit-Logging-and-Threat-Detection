import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  History,
  Share2,
  Shield,
  FileSearch,
  Users,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/my-files', icon: FileText, label: 'My Files' },
    { to: '/share-links', icon: Share2, label: 'Share Links' },
    { to: '/audit-logs', icon: FileSearch, label: 'Audit Logs' },
    { to: '/threat-detection', icon: Shield, label: 'Threat Detection' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ to: '/admin', icon: Users, label: 'Admin Panel' });
  }

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6" />
          SentinelShare
        </h1>
      </div>

      <nav className="flex-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="mb-4 px-4">
          <p className="text-sm text-gray-400">Logged in as</p>
          <p className="font-medium truncate">{user?.email}</p>
          {user?.role && (
            <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-600 rounded">
              {user.role}
            </span>
          )}
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
