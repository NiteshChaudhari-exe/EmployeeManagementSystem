// Reports Page

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { BarChart3, Download, FileText, TrendingUp } from 'lucide-react';

const Reports = () => {
  const reports = [
    { title: 'Employee Attendance Report', description: 'Monthly attendance summary', icon: FileText },
    { title: 'Department Performance', description: 'Department-wise analytics', icon: TrendingUp },
    { title: 'Payroll Summary', description: 'Salary disbursement report', icon: BarChart3 },
    { title: 'Leave Analysis', description: 'Leave trends and patterns', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Generate and download various reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <report.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>{report.title}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;
