// Leave Management Page

import React from 'react';
import { mockLeaveRequests, mockEmployees } from '@/app/data/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { FileText, Plus } from 'lucide-react';

const Leaves = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Requests</h1>
          <p className="text-gray-600 mt-1">Manage employee leave applications</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Leave Request
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-4xl font-bold text-yellow-600 mt-2">
                {mockLeaveRequests.filter((l) => l.status === 'pending').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {mockLeaveRequests.filter((l) => l.status === 'approved').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-4xl font-bold text-red-600 mt-2">
                {mockLeaveRequests.filter((l) => l.status === 'rejected').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLeaveRequests.map((leave) => {
                const employee = mockEmployees.find((e) => e.id === leave.employeeId);
                return (
                  <TableRow key={leave.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{employee?.firstName} {employee?.lastName}</p>
                        <p className="text-sm text-gray-500">{employee?.employeeId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{leave.leaveType}</TableCell>
                    <TableCell>{leave.days} day(s)</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{new Date(leave.startDate).toLocaleDateString()}</p>
                        <p className="text-gray-500">to {new Date(leave.endDate).toLocaleDateString()}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{leave.reason}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          leave.status === 'approved'
                            ? 'default'
                            : leave.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {leave.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {leave.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Approve</Button>
                          <Button size="sm" variant="outline">Reject</Button>
                        </div>
                      )}
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

export default Leaves;
