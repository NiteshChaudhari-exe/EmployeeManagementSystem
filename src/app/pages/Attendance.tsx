// Attendance Management Page

import React from 'react';
import { mockAttendance, mockEmployees } from '@/app/data/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Calendar, Clock } from 'lucide-react';

const Attendance = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-1">Track and manage employee attendance</p>
        </div>
        <Button>
          <Clock className="w-4 h-4 mr-2" />
          Mark Attendance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Present Today</p>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {mockAttendance.filter((a) => a.status === 'present').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Work Hours</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">
                {mockAttendance.reduce((sum, a) => sum + (a.workHours || 0), 0).toFixed(1)}h
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Average Hours</p>
              <p className="text-4xl font-bold text-purple-600 mt-2">
                {(mockAttendance.reduce((sum, a) => sum + (a.workHours || 0), 0) / mockAttendance.length).toFixed(1)}h
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Work Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAttendance.map((record) => {
                const employee = mockEmployees.find((e) => e.id === record.employeeId);
                return (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{employee?.firstName} {employee?.lastName}</p>
                        <p className="text-sm text-gray-500">{employee?.employeeId}</p>
                      </div>
                    </TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut || '-'}</TableCell>
                    <TableCell>{record.workHours ? `${record.workHours}h` : '-'}</TableCell>
                    <TableCell>
                      <Badge variant={record.status === 'present' ? 'default' : 'secondary'}>
                        {record.status}
                      </Badge>
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

export default Attendance;
