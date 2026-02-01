// Dashboard Page Component

import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '@/app/store';
import { mockDepartments, mockAttendance, mockLeaveRequests, mockPayrollRecords } from '@/app/data/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, UserCheck, UserX, FileText, DollarSign, TrendingUp, Calendar, Building2 } from 'lucide-react';
import { useAuth } from '@/app/hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const employees = useSelector((state: RootState) => state.employees.employees);
  const navigate = useNavigate();

  // Calculate statistics
  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter((e) => e.status === 'active').length,
    totalDepartments: mockDepartments.length,
    pendingLeaves: mockLeaveRequests.filter((l) => l.status === 'pending').length,
    todayPresent: mockAttendance.filter((a) => a.status === 'present').length,
    todayAbsent: employees.length - mockAttendance.filter((a) => a.status === 'present').length,
    monthlyPayroll: mockPayrollRecords.reduce((sum, p) => sum + p.netSalary, 0),
  };

  // Department distribution data
  const deptData = mockDepartments.map((dept) => ({
    name: dept.name,
    count: employees.filter((emp) => emp.departmentId === dept.id).length,
  }));

  // Status distribution data
  const statusData = [
    { name: 'Active', value: employees.filter((e) => e.status === 'active').length },
    { name: 'Resigned', value: employees.filter((e) => e.status === 'resigned').length },
    { name: 'Terminated', value: employees.filter((e) => e.status === 'terminated').length },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user?.name}! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/employees')}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalEmployees}</p>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  {stats.activeEmployees} active
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/departments')}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalDepartments}</p>
                <p className="text-xs text-gray-500 mt-1">Across organization</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/attendance')}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Attendance</p>
                <div className="flex items-center gap-4 mt-1">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{stats.todayPresent}</p>
                    <p className="text-xs text-gray-500">Present</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{stats.todayAbsent}</p>
                    <p className="text-xs text-gray-500">Absent</p>
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/leaves')}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Leaves</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{stats.pendingLeaves}</p>
                <p className="text-xs text-gray-500 mt-1">Needs approval</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Employees by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockLeaveRequests.slice(0, 5).map((leave) => {
                const employee = employees.find((e) => e.id === leave.employeeId);
                return (
                  <div key={leave.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">
                        {employee?.firstName} {employee?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)} Leave - {leave.days} day(s)
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        leave.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : leave.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </div>
                );
              })}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/leaves')}>
              View All Requests
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => navigate('/employees')}>
                <Users className="w-6 h-6" />
                <span>Add Employee</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => navigate('/attendance')}>
                <Calendar className="w-6 h-6" />
                <span>Mark Attendance</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => navigate('/payroll')}>
                <DollarSign className="w-6 h-6" />
                <span>Generate Payroll</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => navigate('/reports')}>
                <FileText className="w-6 h-6" />
                <span>View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
