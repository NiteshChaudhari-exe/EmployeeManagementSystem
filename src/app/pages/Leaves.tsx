// Leave Management Page

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { 
  fetchLeaveRequests, 
  approveLeaveRequest,
  rejectLeaveRequest,
  clearError
} from '@/app/store/leaveSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/app/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/app/components/ui/alert';
import { Plus, Check, X, AlertCircle, Filter, Download } from 'lucide-react';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { toast } from 'sonner';

const Leaves = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { requests, loading, error } = useSelector(
    (state: RootState) => state.leaves
  );
  
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLeaveType, setFilterLeaveType] = useState('all');

  useEffect(() => {
    dispatch(fetchLeaveRequests());
  }, [dispatch]);
  
  // Filter requests
  const filteredRequests = requests.filter((r: any) => {
    const statusMatch = filterStatus === 'all' || r.status === filterStatus;
    const typeMatch = filterLeaveType === 'all' || r.leaveType === filterLeaveType;
    return statusMatch && typeMatch;
  });

  const pendingCount = requests.filter((r: any) => r.status === 'pending').length;
  const approvedCount = requests.filter((r: any) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r: any) => r.status === 'rejected').length;

  const handleApprove = async (id: string) => {
    try {
      await dispatch(approveLeaveRequest(id)).unwrap();
      toast.success('Leave approved!');
      dispatch(fetchLeaveRequests());
    } catch (err: any) {
      toast.error(err || 'Failed to approve leave');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await dispatch(rejectLeaveRequest({ id, reason: 'Rejected by manager' })).unwrap();
      toast.success('Leave rejected!');
      dispatch(fetchLeaveRequests());
    } catch (err: any) {
      toast.error(err || 'Failed to reject leave');
    }
  };
  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={() => dispatch(clearError())}>
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

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
              <p className="text-4xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{approvedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-4xl font-bold text-red-600 mt-2">{rejectedCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Leave Type</label>
              <Select value={filterLeaveType} onValueChange={setFilterLeaveType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="casual">Casual Leave</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="personal">Personal Leave</SelectItem>
                  <SelectItem value="annual">Annual Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 flex items-end gap-2">
              <Button 
                variant="outline"
                onClick={() => {
                  setFilterStatus('all');
                  setFilterLeaveType('all');
                }}
                className="w-full"
              >
                Reset
              </Button>
              <Button 
                onClick={() => {
                  const filtered = filteredRequests
                    .map(r => [r.employeeId, new Date(r.startDate).toLocaleDateString(), new Date(r.endDate).toLocaleDateString(), r.leaveType, r.status].join(','))
                    .join('\n');
                  const csv = 'Employee ID,Start Date,End Date,Leave Type,Status\n' + filtered;
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'leave-requests.csv';
                  a.click();
                  toast.success('Downloaded leave-requests.csv');
                }}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Leave Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((leave) => (
                  <TableRow key={leave._id}>
                    <TableCell className="font-medium">{leave.employeeId}</TableCell>
                    <TableCell className="capitalize">{leave.leaveType}</TableCell>
                    <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
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
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleApprove(leave._id)}
                            disabled={loading}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleReject(leave._id)}
                            disabled={loading}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    No leave requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {total > 10 && (
            <p className="text-sm text-gray-500 mt-4">
              Showing {requests.length} of {total} requests
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaves;
