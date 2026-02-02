// Departments Page

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { 
  fetchDepartments, 
  createDepartment,
  updateDepartment,
  deleteDepartment,
  clearError
} from '@/app/store/departmentSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Building2, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import LoadingSpinner from '@/app/components/LoadingSpinner';

const Departments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { departments, loading, error } = useSelector(
    (state: RootState) => state.departments
  );
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    headId: '',
  });

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleAdd = async () => {
    if (!formData.name) return;
    try {
      await dispatch(createDepartment({
        name: formData.name,
        description: formData.description,
        headId: formData.headId,
      } as any)).unwrap();
      toast.success('Department created successfully!');
      setIsAddDialogOpen(false);
      setFormData({ name: '', description: '', headId: '' });
      dispatch(fetchDepartments());
    } catch (err: any) {
      toast.error(err || 'Failed to create department');
    }
  };

  const handleEdit = async () => {
    if (!selectedDept || !formData.name) return;
    try {
      await dispatch(updateDepartment({
        id: selectedDept._id,
        data: {
          name: formData.name,
          description: formData.description,
          headId: formData.headId,
        },
      })).unwrap();
      toast.success('Department updated successfully!');
      setIsEditDialogOpen(false);
      setSelectedDept(null);
      setFormData({ name: '', description: '', headId: '' });
      dispatch(fetchDepartments());
    } catch (err: any) {
      toast.error(err || 'Failed to update department');
    }
  };

  const handleDelete = async (dept: any) => {
    if (confirm(`Delete ${dept.name}? This action cannot be undone.`)) {
      try {
        await dispatch(deleteDepartment(dept._id)).unwrap();
        toast.success('Department deleted successfully!');
        dispatch(fetchDepartments());
      } catch (err: any) {
        toast.error(err || 'Failed to delete department');
      }
    }
  };

  const openEditDialog = (dept: any) => {
    setSelectedDept(dept);
    setFormData({
      name: dept.name,
      description: dept.description,
      headId: dept.headId || '',
    });
    setIsEditDialogOpen(true);
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">Organizational structure and department overview</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Department
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

      {loading && <LoadingSpinner loading={true} message="Loading departments..." />}

      {!loading && departments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No departments found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept: any) => (
            <Card key={dept._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{dept.name}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">{dept.description}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Total Staff</span>
                  </div>
                  <Badge variant="secondary">{dept.employeeCount || 0}</Badge>
                </div>
                <div className="pt-4 border-t flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(dept)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(dept)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Department Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Department Name</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Engineering"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Department description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Department Name</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Departments;
