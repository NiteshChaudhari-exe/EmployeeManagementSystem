// Main Layout Component with Sidebar and Header

import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '@/app/store/authSlice';
import { useAuth } from '@/app/hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  FileText,
  DollarSign,
  BarChart3,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

const Navigation = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['admin', 'hr_manager', 'employee'],
    },
    {
      label: 'Employees',
      path: '/employees',
      icon: <Users className="w-5 h-5" />,
      roles: ['admin', 'hr_manager'],
    },
    {
      label: 'Departments',
      path: '/departments',
      icon: <Building2 className="w-5 h-5" />,
      roles: ['admin', 'hr_manager'],
    },
    {
      label: 'Attendance',
      path: '/attendance',
      icon: <Calendar className="w-5 h-5" />,
      roles: ['admin', 'hr_manager', 'employee'],
    },
    {
      label: 'Leave Requests',
      path: '/leaves',
      icon: <FileText className="w-5 h-5" />,
      roles: ['admin', 'hr_manager', 'employee'],
    },
    {
      label: 'Payroll',
      path: '/payroll',
      icon: <DollarSign className="w-5 h-5" />,
      roles: ['admin', 'hr_manager'],
    },
    {
      label: 'Reports',
      path: '/reports',
      icon: <BarChart3 className="w-5 h-5" />,
      roles: ['admin', 'hr_manager'],
    },
  ];

  const filteredNav = navItems.filter((item) => hasRole(item.roles));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">EMS Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Employee Management</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {filteredNav.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role.replace('_', ' ')}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Mobile */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">EMS Portal</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 p-4 space-y-1">
            {filteredNav.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Navigation;
