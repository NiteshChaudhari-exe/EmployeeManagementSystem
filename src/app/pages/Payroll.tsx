// Payroll Management Page

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { 
  fetchPayrollRecords, 
  generatePayroll,
  clearError
} from '@/app/store/payrollSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/app/components/ui/alert';
import { DollarSign, Download, AlertCircle, Filter } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/app/components/ui/select';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { toast } from 'sonner';

const Payroll = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { records, loading, error, total } = useSelector((state: RootState) => state.payroll);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [generateMonth, setGenerateMonth] = useState('');
  const [generateYear, setGenerateYear] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMonth, setFilterMonth] = useState('');

  useEffect(() => {
    dispatch(fetchPayrollRecords());
  }, [dispatch]);
  
  // Filter records
  const filteredRecords = records.filter((r: any) => {
    const statusMatch = filterStatus === 'all' || r.status === filterStatus;
    const monthMatch = !filterMonth || `${r.month}/${r.year}`.includes(filterMonth);
    return statusMatch && monthMatch;
  });

  const handleGenerate = async () => {
    if (!generateMonth || !generateYear) {
      toast.error('Please select month and year');
      return;
    }
    try {
      await dispatch(generatePayroll({ 
        month: parseInt(generateMonth), 
        year: parseInt(generateYear) 
      })).unwrap();
      toast.success('Payroll generated successfully!');
      setGenerateOpen(false);
      setGenerateMonth('');
      setGenerateYear('');
      dispatch(fetchPayrollRecords());
    } catch (err: any) {
      toast.error(err || 'Failed to generate payroll');
    }
  };

  const totalPayroll = records.reduce((sum, p) => sum + (p.netAmount || 0), 0);
  const paidCount = records.filter((p) => p.status === 'paid').length;
  const pendingCount = records.filter((p) => p.status === 'pending').length;

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
          <h1 className="text-3xl font-bold text-gray-900">Payroll</h1>
          <p className="text-gray-600 mt-1">Manage employee payroll and salary</p>
        </div>
        <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
          <DialogTrigger asChild>
            <Button>
              <DollarSign className="w-4 h-4 mr-2" />
              Generate Payroll
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Payroll</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Month</Label>
                <Input 
                  type="number" 
                  min="1" 
                  max="12" 
                  placeholder="1-12"
                  value={generateMonth}
                  onChange={(e) => setGenerateMonth(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input 
                  type="number" 
                  placeholder="2026"
                  value={generateYear}
                  onChange={(e) => setGenerateYear(e.target.value)}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setGenerateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleGenerate}>
                  Generate
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
              <p className="text-4xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
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
              <label className="text-sm font-medium text-gray-700 mb-1 block">Month</label>
              <Input 
                type="month" 
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 flex items-end gap-2">
              <Button 
                variant="outline"
                onClick={() => {
                  setFilterMonth('');
                  setFilterStatus('all');
                }}
                className="w-full"
              >
                Reset
              </Button>
              <Button 
                onClick={() => {
                  const filtered = filteredRecords
                    .map(r => [r.employeeId, `${r.month}/${r.year}`, r.basicSalary, r.deductions, r.netAmount, r.status].join(','))
                    .join('\n');
                  const csv = 'Employee ID,Month/Year,Basic Salary,Deductions,Net Amount,Status\n' + filtered;
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'payroll.csv';
                  a.click();
                  toast.success('Downloaded payroll.csv');
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
              <label className="text-sm font-medium text-gray-700 mb-1 block">Month</label>
              <Input 
                type="month" 
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 flex items-end gap-2">
              <Button 
                variant="outline"
                onClick={() => {
                  setFilterMonth('');
                  setFilterStatus('all');
                }}
                className="w-full"
              >
                Reset
              </Button>
              <Button 
                onClick={() => {
                  const filtered = filteredRecords
                    .map(r => [r.employeeId, `${r.month}/${r.year}`, r.basicSalary, r.deductions, r.netAmount, r.status].join(','))
                    .join('\n');
                  const csv = 'Employee ID,Month/Year,Basic Salary,Deductions,Net Amount,Status\n' + filtered;
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'payroll.csv';
                  a.click();
                  toast.success('Downloaded payroll.csv');
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
          <CardTitle>Payroll Records ({filteredRecords.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Month/Year</TableHead>
                <TableHead>Basic Salary</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((payroll) => (
                  <TableRow key={payroll._id}>
                    <TableCell className="font-medium">{payroll.employeeId}</TableCell>
                    <TableCell>{payroll.month}/{payroll.year}</TableCell>
                    <TableCell>${(payroll.basicSalary || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-red-600">-${(payroll.deductions || 0).toLocaleString()}</TableCell>
                    <TableCell className="font-bold">${(payroll.netAmount || 0).toLocaleString()}</TableCell>
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    No payroll records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {total > 10 && (
            <p className="text-sm text-gray-500 mt-4">
              Showing {records.length} of {total} records
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Payroll;
