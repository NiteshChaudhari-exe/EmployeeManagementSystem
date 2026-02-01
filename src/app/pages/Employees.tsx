// Employees Management Page

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/app/store';
import { addEmployee, updateEmployee, deleteEmployee } from '@/app/store/employeeSlice';
import { mockDepartments } from '@/app/data/mockData';
import type { Employee } from '@/app/types';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/app/components/ui/alert-dialog';
import { Search, Plus, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

const Employees = () => {
  const employees = useSelector((state: RootState) => state.employees.employees);
  const dispatch = useDispatch();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    departmentId: '',
    designation: '',
    joinDate: '',
    basicSalary: '',
    allowances: '',
    status: 'active' as const,
  });

  // Filter employees
  const filteredEmployees = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      departmentId: '',
      designation: '',
      joinDate: '',
      basicSalary: '',
      allowances: '',
      status: 'active',
    });
  };

  const handleAdd = () => {
    const newEmployee: Employee = {
      id: `emp-${Date.now()}`,
      ...formData,
      employeeId: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      basicSalary: parseFloat(formData.basicSalary),
      allowances: parseFloat(formData.allowances),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    dispatch(addEmployee(newEmployee));
    toast.success('Employee added successfully!');
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedEmployee) return;
    
    const updatedEmployee: Employee = {
      ...selectedEmployee,
      ...formData,
      basicSalary: parseFloat(formData.basicSalary),
      allowances: parseFloat(formData.allowances),
      updatedAt: new Date().toISOString(),
    };
    
    dispatch(updateEmployee(updatedEmployee));
    toast.success('Employee updated successfully!');
    setIsEditDialogOpen(false);
    setSelectedEmployee(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!selectedEmployee) return;
    
    dispatch(deleteEmployee(selectedEmployee.id));
    toast.success('Employee deleted successfully!');
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  const openEditDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      dateOfBirth: employee.dateOfBirth,
      address: employee.address,
      departmentId: employee.departmentId,
      designation: employee.designation,
      joinDate: employee.joinDate,
      basicSalary: employee.basicSalary.toString(),
      allowances: employee.allowances.toString(),
      status: employee.status,
    });
    setIsEditDialogOpen(true);
  };

  const getDepartmentName = (deptId: string) => {
    return mockDepartments.find((d) => d.id === deptId)?.name || 'N/A';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-1">Manage employee records and information</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, or employee ID..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee List ({filteredEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.employeeId}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                        <p className="text-sm text-gray-500">{employee.designation}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {employee.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {employee.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getDepartmentName(employee.departmentId)}</TableCell>
                    <TableCell>{employee.designation}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          employee.status === 'active'
                            ? 'default'
                            : employee.status === 'resigned'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(employee)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Employee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={formData.departmentId} onValueChange={(value) => setFormData({ ...formData, departmentId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {mockDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Designation</Label>
              <Input value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Join Date</Label>
              <Input type="date" value={formData.joinDate} onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Basic Salary</Label>
              <Input type="number" value={formData.basicSalary} onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Allowances</Label>
              <Input type="number" value={formData.allowances} onChange={(e) => setFormData({ ...formData, allowances: e.target.value })} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Address</Label>
              <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="resigned">Resigned</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={formData.departmentId} onValueChange={(value) => setFormData({ ...formData, departmentId: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Designation</Label>
              <Input value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Basic Salary</Label>
              <Input type="number" value={formData.basicSalary} onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Address</Label>
              <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedEmployee?.firstName} {selectedEmployee?.lastName} from the system.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Employees;
