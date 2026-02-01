// Payroll Management Page

import React from 'react';
import { mockPayrollRecords, mockEmployees } from '@/app/data/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { DollarSign, Download } from 'lucide-react';

const Payroll = () => {
  const totalPayroll = mockPayrollRecords.reduce((sum, p) => sum + p.netSalary, 0);
  const paidCount = mockPayrollRecords.filter((p) => p.status === 'paid').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payroll</h1>
          <p className="text-gray-600 mt-1">Manage employee payroll and salary</p>
        </div>
        <Button>
          <DollarSign className="w-4 h-4 mr-2" />
          Generate Payroll
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Payroll</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">
                ${totalPayroll.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{paidCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-4xl font-bold text-yellow-600 mt-2">
                {mockPayrollRecords.length - paidCount}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>January 2026 Payroll</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Basic Salary</TableHead>
                <TableHead>Allowances</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayrollRecords.map((payroll) => {
                const employee = mockEmployees.find((e) => e.id === payroll.employeeId);
                return (
                  <TableRow key={payroll.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{employee?.firstName} {employee?.lastName}</p>
                        <p className="text-sm text-gray-500">{employee?.employeeId}</p>
                      </div>
                    </TableCell>
                    <TableCell>${payroll.basicSalary.toLocaleString()}</TableCell>
                    <TableCell>${payroll.allowances.toLocaleString()}</TableCell>
                    <TableCell className="text-red-600">-${payroll.deductions.toLocaleString()}</TableCell>
                    <TableCell className="font-bold">${payroll.netSalary.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={payroll.status === 'paid' ? 'default' : 'secondary'}>
                        {payroll.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Payslip
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payroll;
