# 📋 WEEK 3 IMPLEMENTATION PLAN - Frontend-Backend Integration & Advanced Endpoints

**Date:** February 1, 2026  
**Phase:** 3 of 5  
**Duration:** 16-20 hours  
**Focus:** Frontend-Backend Integration, Advanced API Endpoints

---

## 🎯 Week 3 Objectives

1. Connect frontend authentication to backend JWT system
2. Implement backend API calls for all resource endpoints
3. Add advanced features: filtering, pagination, search
4. Create dashboard data aggregation endpoints
5. Implement file upload functionality (profiles/documents)
6. Add email notification system (backend)

---

## 📊 Current Status

### Week 2 Deliverables ✅
- MongoDB + Mongoose connected
- 6 database models implemented
- JWT authentication service
- Role-based access control middleware
- 18 API endpoints across 5 resources
- Backend server running on localhost:5000

### Frontend Status ✅
- React 18 with TypeScript
- Redux Toolkit for state management
- Shadcn/ui component library
- 8 page components (Login, Dashboard, Employees, etc.)
- Mock data for demo
- 31/31 tests passing

---

## 📅 Week 3 Task Breakdown

### Task 1: Authentication Integration (3-4 hours)

**Objective:** Connect frontend Login to backend JWT system

**Deliverables:**

1. **Update authSlice.ts with real API calls**
   - `loginUser(email, password)` - POST /api/auth/login
   - `registerUser(data)` - POST /api/auth/register
   - `getCurrentUser()` - GET /api/auth/me
   - `logout()` - Clear token and user state

2. **Create API service/client**
   - `src/services/api.ts` or `src/api/client.ts`
   - Base URL: `http://localhost:5000/api`
   - Add Authorization header with JWT token
   - Handle token expiration and refresh

3. **Implement Token Storage**
   - Store JWT in Redux state (not localStorage initially)
   - Add token to all API request headers
   - Implement automatic token refresh on expiration

4. **Update Login Page**
   - Connect form submission to Redux loginUser action
   - Show loading state during API call
   - Display error messages from backend
   - Redirect to Dashboard on success

5. **Update Register Page** (create if needed)
   - Form validation (frontend + backend)
   - Call registerUser action
   - Auto-login after registration
   - Redirect to Dashboard

6. **Protected Routes Implementation**
   - Create PrivateRoute component
   - Check Redux for authenticated user
   - Redirect unauthenticated users to Login
   - Apply to all protected pages

**Files to Create/Update:**
```
src/
├── services/
│   └── api.ts (NEW) - API client configuration
├── app/
│   ├── pages/
│   │   ├── Login.tsx - Connect to backend
│   │   └── Register.tsx (NEW) - Registration page
│   └── store/
│       └── authSlice.ts - Update with API calls
└── components/
    └── PrivateRoute.tsx (NEW) - Route protection
```

**Testing Checklist:**
- [ ] Login with valid credentials returns JWT token
- [ ] Token stored in Redux state
- [ ] Token included in subsequent API requests
- [ ] Invalid credentials show error message
- [ ] Register creates new user and logs in
- [ ] Logout clears token and redirects to login
- [ ] Protected routes redirect unauthenticated users

---

### Task 2: Employee Management Integration (4-5 hours)

**Objective:** Connect Employee page to backend /api/employees endpoints

**Deliverables:**

1. **Create Employee API Service**
   - `getEmployees()` - GET /api/employees
   - `getEmployee(id)` - GET /api/employees/:id
   - `createEmployee(data)` - POST /api/employees
   - `updateEmployee(id, data)` - PUT /api/employees/:id
   - `deleteEmployee(id)` - DELETE /api/employees/:id

2. **Update employeeSlice.ts**
   - `fetchEmployees()` - Thunk to get all employees
   - `fetchEmployeeById(id)` - Thunk to get single employee
   - `addEmployee(data)` - Thunk to create
   - `editEmployee(id, data)` - Thunk to update
   - `removeEmployee(id)` - Thunk to delete
   - Loading states and error handling

3. **Update Employees.tsx Page**
   - Dispatch fetchEmployees on component mount
   - Display employees from Redux state
   - Show loading spinner while fetching
   - Display error messages if API fails
   - Add search/filter functionality
   - Implement pagination

4. **Create Employee CRUD Forms**
   - CreateEmployeeForm component
   - EditEmployeeForm component
   - Form validation (frontend)
   - Handle API success/error responses
   - Close modals on success

5. **Add Advanced Features**
   - **Search:** Filter by name, email, position
   - **Filter:** By department, status, salary range
   - **Pagination:** 10 employees per page
   - **Sorting:** By name, salary, join date
   - **Export:** Download employee list as CSV

6. **Implement Populate Features**
   - Display department name (via ref)
   - Display user name from User model
   - Show formatted dates

**Files to Create/Update:**
```
src/
├── services/
│   └── employeeApi.ts (NEW) - Employee API calls
├── app/
│   ├── pages/
│   │   └── Employees.tsx - Connect to backend
│   ├── components/
│   │   ├── CreateEmployeeForm.tsx (NEW)
│   │   ├── EditEmployeeForm.tsx (NEW)
│   │   └── EmployeeTable.tsx (NEW)
│   └── store/
│       └── employeeSlice.ts - Add thunks
└── hooks/
    └── useEmployee.ts (NEW) - Custom hook
```

**API Endpoints Used:**
```
GET  /api/employees
GET  /api/employees/:id
POST /api/employees (HR Manager+)
PUT  /api/employees/:id (HR Manager+)
DELETE /api/employees/:id (Admin)
```

**Testing Checklist:**
- [ ] Employees load on page mount
- [ ] Can create new employee (form + API)
- [ ] Can edit employee details
- [ ] Can delete employee
- [ ] Search filters employees by name/email
- [ ] Pagination shows 10 per page
- [ ] Department name displays correctly
- [ ] Authorization errors handled

---

### Task 3: Department Management Integration (3 hours)

**Objective:** Connect Department page to backend

**Deliverables:**

1. **Create Department API Service**
   - CRUD operations for departments
   - Similar structure to Employee service

2. **Update Departments.tsx**
   - Fetch departments on mount
   - Display department cards/table
   - Add create/edit/delete functionality
   - Show employee count per department

3. **Create Department Forms**
   - CreateDepartmentForm
   - EditDepartmentForm

**Files to Create:**
```
src/
├── services/
│   └── departmentApi.ts (NEW)
├── app/
│   ├── pages/
│   │   └── Departments.tsx - Update
│   └── components/
│       ├── CreateDepartmentForm.tsx (NEW)
│       └── EditDepartmentForm.tsx (NEW)
```

---

### Task 4: Attendance Integration (3 hours)

**Objective:** Attendance tracking page integration

**Deliverables:**

1. **Create Attendance API Service**
   - Get attendance records
   - Log attendance (check-in/check-out)
   - Update attendance records

2. **Update Attendance.tsx Page**
   - Display attendance calendar
   - Show check-in/check-out times
   - Allow HR to log attendance for employees
   - Show attendance summary/stats

3. **Attendance Forms**
   - Check-in/Check-out component
   - Bulk attendance logging

**Features:**
- Daily attendance view
- Monthly attendance report
- Attendance statistics dashboard
- Check-in/check-out timestamps

---

### Task 5: Leave Management Integration (3 hours)

**Objective:** Connect Leave request page

**Deliverables:**

1. **Create Leave API Service**
   - Get leave requests
   - Submit leave request
   - Approve/reject leave
   - Get leave balance

2. **Update Leaves.tsx Page**
   - Display leave requests (all or current user)
   - Show leave balance
   - Allow submitting leave requests
   - HR Manager can approve/reject

3. **Leave Request Form**
   - Select leave type
   - Start/end dates
   - Reason text area
   - Auto-calculate days

**Features:**
- Leave calendar view
- Leave request status tracking
- Approval workflow
- Leave balance management

---

### Task 6: Payroll Integration (2-3 hours)

**Objective:** Connect Payroll page

**Deliverables:**

1. **Create Payroll API Service**
   - Get payroll records
   - Create payroll entry
   - Generate payroll (batch)
   - View payslips

2. **Update Payroll.tsx Page**
   - Display payroll records
   - Show payslip details
   - HR Manager can generate payroll
   - Download payslip as PDF

**Features:**
- Monthly payroll records
- Payslip generation
- Salary components breakdown
- Payment status tracking

---

### Task 7: Dashboard Data Integration (3-4 hours)

**Objective:** Create real data aggregation endpoints and dashboard visualizations

**Deliverables:**

1. **Backend Dashboard Endpoint (NEW)**
   ```
   GET /api/dashboard/stats
   Returns: {
     totalEmployees: number,
     activeEmployees: number,
     totalDepartments: number,
     pendingLeaves: number,
     attendanceToday: number,
     payrollPending: number
   }
   ```

2. **Dashboard Analytics Endpoints**
   ```
   GET /api/dashboard/employees-by-department
   GET /api/dashboard/attendance-summary
   GET /api/dashboard/leave-summary
   GET /api/dashboard/payroll-summary
   ```

3. **Update Dashboard.tsx**
   - Fetch dashboard stats on mount
   - Display KPI cards (employees, departments, leaves, etc.)
   - Show charts from real data
   - Implement refresh functionality

4. **Create Dashboard Components**
   - StatsCard component
   - EmployeeChart component
   - AttendanceChart component
   - LeaveChart component

**Files:**
```
backend/
└── src/
    └── controllers/
        └── dashboardController.js (NEW)

src/
├── services/
│   └── dashboardApi.ts (NEW)
└── app/
    ├── pages/
    │   └── Dashboard.tsx - Update with real data
    └── components/
        ├── StatsCard.tsx (NEW)
        └── DashboardCharts.tsx (NEW)
```

---

### Task 8: File Upload Functionality (Optional - 2-3 hours)

**Objective:** Allow profile photo and document uploads

**Backend Setup:**
1. Install multer for file uploads
   ```bash
   npm install multer
   ```

2. Create file upload middleware
   - Validate file type and size
   - Store in `/public/uploads/`
   - Save file path in database

3. Add upload endpoint
   ```
   POST /api/employees/:id/upload-photo
   POST /api/employees/:id/upload-documents
   ```

**Frontend Implementation:**
1. Create FileUpload component
2. Add file input to Employee form
3. Handle upload progress
4. Display uploaded images/documents

---

## 🔌 Backend Enhancements Needed

### New Endpoints for Week 3

**Dashboard Endpoints (NEW)**
```
GET  /api/dashboard/stats
GET  /api/dashboard/employees-by-department
GET  /api/dashboard/attendance-summary
GET  /api/dashboard/leave-summary
GET  /api/dashboard/payroll-summary
```

**Advanced Filtering (Update existing)**
```
GET /api/employees?department=dept_id&status=active&page=1&limit=10&sort=name
GET /api/leaves?status=pending&employee=emp_id
GET /api/attendance?employee=emp_id&month=2024-01
GET /api/payroll?employee=emp_id&month=2024-01&status=pending
```

**File Upload (NEW)**
```
POST /api/employees/:id/upload-photo
POST /api/employees/:id/upload-document
```

**Leave Additional**
```
GET /api/leaves/:id/balance (Get remaining balance)
GET /api/employees/:id/leaves (Employee's leaves)
```

**Attendance Additional**
```
GET /api/employees/:id/attendance
POST /api/attendance/check-in
POST /api/attendance/check-out
```

---

## 🛠️ Development Workflow

### Day 1-2: Authentication & Setup
- [ ] Set up API client in frontend
- [ ] Implement Redux auth integration
- [ ] Create PrivateRoute component
- [ ] Test login/logout flow

### Day 3-4: Employee Management
- [ ] Connect Employee page to backend
- [ ] Implement CRUD forms
- [ ] Add search/filter/pagination
- [ ] Test all operations

### Day 5: Departments, Attendance, Leave
- [ ] Integrate Department page
- [ ] Integrate Attendance page
- [ ] Integrate Leave page
- [ ] Quick testing

### Day 6: Payroll & Dashboard
- [ ] Integrate Payroll page
- [ ] Create dashboard stats endpoints
- [ ] Update Dashboard with real data
- [ ] Integration testing

### Day 7: Polish & Testing
- [ ] Error handling refinement
- [ ] Loading states
- [ ] Form validation
- [ ] End-to-end testing
- [ ] Documentation updates

---

## 📝 Key Decisions

### API Client Setup
**Recommendation:** Create a centralized API client with:
- Base configuration
- Automatic header injection (Auth token)
- Error handling middleware
- Request/response interceptors

### State Management
**Approach:** Redux Toolkit with async thunks
- Keep auth in Redux
- Keep resource data in Redux
- Dispatch thunks on component mount
- Handle loading/error states

### Error Handling
**Strategy:**
- Display user-friendly error messages
- Log errors to console (dev)
- Retry failed requests once
- Show error toast notifications

### Form Validation
**Approach:** React Hook Form + backend validation
- Frontend: Quick user feedback
- Backend: Security validation
- Show field-level errors

---

## 🧪 Testing Strategy

### Frontend Testing
- [ ] Login/register flows
- [ ] CRUD operations for each resource
- [ ] Search/filter functionality
- [ ] Error scenarios
- [ ] Loading states
- [ ] Protected routes

### Integration Testing
- [ ] Frontend ↔ Backend communication
- [ ] Data persistence
- [ ] Authorization enforcement
- [ ] Error handling
- [ ] Token refresh flow

### Manual Testing
- [ ] Test with different user roles
- [ ] Test all CRUD operations
- [ ] Test edge cases
- [ ] Test with slow network
- [ ] Test error scenarios

---

## 📊 Success Criteria

By end of Week 3:
- [ ] All 5 resource pages connected to backend
- [ ] Authentication working with real JWT
- [ ] CRUD operations for all resources
- [ ] Search/filter/pagination implemented
- [ ] Dashboard showing real data
- [ ] No mock data remaining
- [ ] All routes protected with authorization
- [ ] Error messages displayed to user
- [ ] Loading states during API calls
- [ ] Forms submit to backend successfully

---

## 🔒 Security Considerations

1. **Token Storage**
   - Store in Redux (not localStorage to avoid XSS)
   - Clear on logout
   - Refresh on expiration

2. **Authorization**
   - Enforce on frontend (UI) and backend (API)
   - Check user role before showing options
   - Prevent direct URL access to protected pages

3. **Input Validation**
   - Validate on frontend (UX)
   - Validate on backend (security)
   - Sanitize inputs

4. **CORS**
   - Already configured in backend
   - Update CORS_ORIGIN if deploying

---

## 📚 Documentation Updates

- [ ] Update API documentation
- [ ] Add testing guide
- [ ] Update architecture diagram
- [ ] Add user guide for frontend
- [ ] Create deployment guide

---

## ⏭️ Week 4 Preview

After Week 3 completion:
- Advanced reporting features
- Batch operations (bulk import/export)
- Dashboard customization
- Email notifications
- Performance optimization

---

## 🎯 Estimated Effort

| Task | Hours | Difficulty |
|------|-------|-----------|
| Task 1: Auth Integration | 4 | Medium |
| Task 2: Employee Integration | 5 | Medium |
| Task 3: Department Integration | 3 | Low |
| Task 4: Attendance Integration | 3 | Low |
| Task 5: Leave Integration | 3 | Low |
| Task 6: Payroll Integration | 3 | Low |
| Task 7: Dashboard Integration | 4 | Medium |
| Task 8: File Upload (Optional) | 3 | Medium |
| **Total** | **28** | - |

**Actual Target:** 16-20 hours (focus on critical path)

---

## 💡 Pro Tips for Week 3

1. **Create API client first** - Makes all other tasks easier
2. **Test each integration as you go** - Don't wait until the end
3. **Use Postman** for API testing before integrating
4. **Handle errors gracefully** - Don't let API failures break the app
5. **Show loading states** - Users need feedback during API calls
6. **Keep Redux state clean** - Normalize data, avoid duplication
7. **Test with different roles** - Ensure auth works properly

---

## 🚀 Getting Started

1. Start with Task 1 (Auth Integration)
2. Create API client service layer
3. Update Redux auth slice with thunks
4. Test login/logout thoroughly
5. Move to Task 2 (Employee Integration)
6. Repeat pattern for other resources

---

**Week 3 Ready:** ✅ YES  
**Backend APIs:** ✅ Available  
**Documentation:** ✅ In Place  
**Start Date:** February 2, 2026

Let's build! 🚀
