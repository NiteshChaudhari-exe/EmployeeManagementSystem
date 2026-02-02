// Attendance Management Page

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { 
  fetchAttendance, 
  clearError
} from '@/app/store/attendanceSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Clock } from 'lucide-react';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { toast } from 'sonner';

const Attendance = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { records, loading, error } = useSelector(
    (state: RootState) => state.attendance
  );

  useEffect(() => {
    dispatch(fetchAttendance());
  }, [dispatch]);

  const presentToday = records.filter((r: any) => {
    const date = new Date(r.date);
    const today = new Date();
    return date.toDateString() === today.toDateString() && r.status === 'present';
  }).length;

  const totalWorkHours = records.reduce((sum: number, r: any) => sum + (r.workHours || 0), 0);
  const avgHours = records.length > 0 ? (totalWorkHours / records.length).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-1">Track and manage employee attendance</p>
        </div>
        <Button disabled>
          <Clock className="w-4 h-4 mr-2" />
          Mark Attendance
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => dispatch(clearError())}
            className="mt-2"
          >
            Dismiss
          </Button>
        </div>
      )}

      {loading && <LoadingSpinner loading={true} message="Loading attendance..." />}

      {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Present Today</p>
                  <p className="text-4xl font-bold text-green-600 mt-2">{presentToday}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Work Hours</p>
                  <p className="text-4xl font-bold text-blue-600 mt-2">{totalWorkHours.toFixed(1)}h</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Average Hours</p>
                  <p className="text-4xl font-bold text-purple-600 mt-2">{avgHours}h</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Records ({records.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No attendance records found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Work Hours</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.slice(0, 20).map((record: any) => (
                        <TableRow key={record._id}>
                          <TableCell className="font-medium">{record.employeeId}</TableCell>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>{record.checkInTime}</TableCell>
                          <TableCell>{record.checkOutTime || '-'}</TableCell>
                          <TableCell>{record.workHours || 0}h</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                record.status === 'present'
                                  ? 'default'
                                  : record.status === 'absent'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {records.length > 20 && (
                    <p className="text-sm text-gray-500 mt-4">Showing 20 of {records.length} records</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Attendance;
