// Departments Page

import React from 'react';
import { mockDepartments, mockEmployees } from '@/app/data/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Building2, Users } from 'lucide-react';

const Departments = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
        <p className="text-gray-600 mt-1">Organizational structure and department overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDepartments.map((dept) => {
          const deptEmployees = mockEmployees.filter((e) => e.departmentId === dept.id);
          const head = mockEmployees.find((e) => e.id === dept.headId);
          
          return (
            <Card key={dept.id} className="hover:shadow-lg transition-shadow">
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
                    <span className="text-sm">Employees</span>
                  </div>
                  <Badge variant="secondary">{deptEmployees.length}</Badge>
                </div>
                {head && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500">Department Head</p>
                    <p className="font-medium text-gray-900 mt-1">{head.firstName} {head.lastName}</p>
                    <p className="text-sm text-gray-600">{head.designation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Departments;
