// Reports Page - Analytics & Insights

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { fetchEmployees } from '@/app/store/employeeSlice';
import { fetchDepartments } from '@/app/store/departmentSlice';
import { fetchAttendance } from '@/app/store/attendanceSlice';
import { fetchLeaveRequests } from '@/app/store/leaveSlice';
import { fetchPayrollRecords } from '@/app/store/payrollSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, FileText, TrendingUp } from 'lucide-react';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { toast } from 'sonner';

const Reports = () => {
  const dispatch = useDispatch<AppDispatch>();
  const employees = useSelector((state: RootState) => state.employees.employees);
  const departments = useSelector((state: RootState) => state.departments.departments);
  const attendance = useSelector((state: RootState) => state.attendance.records);
  const leaves = useSelector((state: RootState) => state.leaves.requests);
  const payroll = useSelector((state: RootState) => state.payroll.records);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([
        dispatch(fetchEmployees({ page: 1, limit: 1000 })),
        dispatch(fetchDepartments()),
        dispatch(fetchAttendance()),
        dispatch(fetchLeaveRequests()),
        dispatch(fetchPayrollRecords()),
      ]);
      setLoading(false);
    };
    loadAllData();
  }, [dispatch]);

  // Calculate attendance trends
  const attendanceTrends = attendance
    .reduce((acc: any, record: any) => {
      const date = new Date(record.date).toLocaleDateString();
      const existing = acc.find((a: any) => a.date === date);
      if (existing) {
        if (record.status === 'present') existing.present++;
        if (record.status === 'absent') existing.absent++;
      } else {
        acc.push({
          date,
          present: record.status === 'present' ? 1 : 0,
          absent: record.status === 'absent' ? 1 : 0,
        });
      }
      return acc;
    }, [])
    .slice(-7);

  // Calculate leave distribution
  const leaveDistribution = [
    {
      name: 'Pending',
      value: leaves.filter((l: any) => l.status === 'pending').length,
    },
    {
      name: 'Approved',
      value: leaves.filter((l: any) => l.status === 'approved').length,
    },
    {
      name: 'Rejected',
      value: leaves.filter((l: any) => l.status === 'rejected').length,
    },
  ];

  // Calculate payroll statistics
  const payrollStats = payroll
    .reduce((acc: any, record: any) => {
      const month = `${record.month}/${record.year}`;
      const existing = acc.find((a: any) => a.month === month);
      if (existing) {
        existing.amount += record.netAmount || 0;
        if (record.status === 'paid') existing.paid++;
      } else {
        acc.push({
          month,
          amount: record.netAmount || 0,
          paid: record.status === 'paid' ? 1 : 0,
        });
      }
      return acc;
    }, [])
    .slice(-6);

  // Department wise employees
  const deptWiseEmployees = departments.map((d: any) => ({
    name: d.name,
    count: employees.filter((e: any) => e.departmentId === d._id).length,
  }));

  // Calculate metrics
  const metrics = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter((e: any) => e.status === 'active').length,
    totalAttendanceRecords: attendance.length,
    avgAttendanceRate: attendance.length > 0
      ? ((attendance.filter((a: any) => a.status === 'present').length / attendance.length) * 100).toFixed(1)
      : 0,
    totalLeaveRequests: leaves.length,
    leaveApprovalRate: leaves.length > 0
      ? ((leaves.filter((l: any) => l.status === 'approved').length / leaves.length) * 100).toFixed(1)
      : 0,
    totalPayroll: payroll.reduce((sum: number, p: any) => sum + (p.netAmount || 0), 0),
    paidPayroll: payroll.filter((p: any) => p.status === 'paid').reduce((sum: number, p: any) => sum + (p.netAmount || 0), 0),
  };

  const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'];

  const exportReport = () => {
    const reportData = {
      generatedOn: new Date().toLocaleDateString(),
      metrics,
      summary: {
        employees: `Active: ${metrics.activeEmployees}/${metrics.totalEmployees}`,
        attendance: `${metrics.avgAttendanceRate}% average rate (${metrics.totalAttendanceRecords} records)`,
        leaves: `${metrics.leaveApprovalRate}% approval rate (${metrics.totalLeaveRequests} requests)`,
        payroll: `Total: $${metrics.totalPayroll.toLocaleString()} | Paid: $${metrics.paidPayroll.toLocaleString()}`,
      },
    };

    const csv = Object.entries(reportData.metrics)
      .map(([key, value]) => `${key},${value}`)
      .join('\n');

    const blob = new Blob([`Report Generated: ${reportData.generatedOn}\n\n${csv}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${new Date().getTime()}.csv`;
    a.click();
    toast.success('Report exported successfully!');
  };

  if (loading) return <LoadingSpinner loading={true} message="Loading report data..." />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and business intelligence</p>
        </div>
        <Button onClick={exportReport}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Active Employees</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {metrics.activeEmployees}/{metrics.totalEmployees}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {metrics.totalEmployees > 0 ? ((metrics.activeEmployees / metrics.totalEmployees) * 100).toFixed(0) : 0}% of workforce
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Attendance Rate</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{metrics.avgAttendanceRate}%</p>
              <p className="text-xs text-gray-500 mt-1">{metrics.totalAttendanceRecords} records</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Leave Approval Rate</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{metrics.leaveApprovalRate}%</p>
              <p className="text-xs text-gray-500 mt-1">{metrics.totalLeaveRequests} requests</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Payroll</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                ${(metrics.totalPayroll / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ${(metrics.paidPayroll / 1000).toFixed(0)}K paid
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Attendance Trends (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {attendanceTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#10b981" name="Present" />
                  <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-8">No attendance data available</p>
            )}
          </CardContent>
        </Card>

        {/* Leave Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Leave Request Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leaves.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={leaveDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leaveDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-8">No leave data available</p>
            )}
          </CardContent>
        </Card>

        {/* Department Wise Employees */}
        <Card>
          <CardHeader>
            <CardTitle>Employees by Department</CardTitle>
          </CardHeader>
          <CardContent>
            {deptWiseEmployees.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={deptWiseEmployees} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-8">No department data available</p>
            )}
          </CardContent>
        </Card>

        {/* Payroll Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Payroll Trend (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            {payrollStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={payrollStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => typeof value === 'number' ? `$${(value / 1000).toFixed(1)}K` : value}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3b82f6" 
                    name="Total Amount"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-8">No payroll data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600">Total Employees</span>
                <span className="font-bold">{metrics.totalEmployees}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600">Active</span>
                <span className="font-bold text-green-600">{metrics.activeEmployees}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Departments</span>
                <span className="font-bold">{departments.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>HR Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600">Pending Leaves</span>
                <span className="font-bold">
                  {leaves.filter((l: any) => l.status === 'pending').length}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600">Total Payroll</span>
                <span className="font-bold text-orange-600">
                  ${(metrics.totalPayroll / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Paid Payroll</span>
                <span className="font-bold text-green-600">
                  ${(metrics.paidPayroll / 1000).toFixed(0)}K
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
