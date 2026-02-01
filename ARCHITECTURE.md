# System Architecture Documentation

## 📐 Employee Management System - Technical Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Login   │  │Dashboard │  │Employees │  │ Leaves   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Attendance│  │ Payroll  │  │  Dept.   │  │ Reports  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌──────────────────────────┴───────────────────────────────────┐
│                     STATE MANAGEMENT LAYER                    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Redux Store (Redux Toolkit)             │   │
│  │                                                      │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐   │   │
│  │  │  Auth      │  │ Employees  │  │   Other    │   │   │
│  │  │  Slice     │  │   Slice    │  │  Slices    │   │   │
│  │  └────────────┘  └────────────┘  └────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌──────────────────────────┴───────────────────────────────────┐
│                     SERVICE LAYER (Mock)                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Mock Auth    │  │ Mock Employee│  │ Mock Leave   │      │
│  │ Service      │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌──────────────────────────┴───────────────────────────────────┐
│                     DATA LAYER (Mock)                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │            LocalStorage (Persistence)              │     │
│  │  - Authentication State                            │     │
│  │  - User Session                                    │     │
│  └────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────┐     │
│  │              Mock Data Store                       │     │
│  │  - Employees  - Departments  - Attendance          │     │
│  │  - Leaves     - Payroll      - Reports             │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Architecture

### Authentication Flow

```
User Login
    ↓
Login Component
    ↓
Submit Credentials
    ↓
Mock Auth Service (Validates against mockUsers)
    ↓
Dispatch login() action
    ↓
Auth Slice updates state
    ↓
Save to LocalStorage
    ↓
Redirect to Dashboard
```

### Employee CRUD Flow

```
User Action (Add/Edit/Delete)
    ↓
Employee Component
    ↓
Dispatch action (addEmployee/updateEmployee/deleteEmployee)
    ↓
Employee Slice
    ↓
Update Redux State
    ↓
Component Re-renders with new data
    ↓
Toast Notification
```

## 🧩 Component Architecture

### Layout Structure

```
App
└── Provider (Redux)
    └── BrowserRouter
        └── Routes
            ├── /login → Login Page
            └── / → Layout (Protected)
                ├── Sidebar Navigation
                ├── Header (Mobile)
                └── Outlet
                    ├── /dashboard → Dashboard
                    ├── /employees → Employees
                    ├── /departments → Departments
                    ├── /attendance → Attendance
                    ├── /leaves → Leaves
                    ├── /payroll → Payroll
                    └── /reports → Reports
```

### Component Hierarchy

```
Layout.tsx
├── Sidebar (Desktop)
│   ├── Logo
│   ├── Navigation Menu
│   │   └── Nav Items (filtered by role)
│   └── User Profile
│       └── Logout Button
├── Mobile Header
│   ├── Logo
│   └── Menu Toggle
├── Mobile Menu (Conditional)
│   ├── Navigation Items
│   └── Logout
└── Main Content Area
    └── <Outlet /> (Page Components)

Dashboard.tsx
├── Header Section
├── Stats Grid (4 cards)
│   ├── Total Employees
│   ├── Departments
│   ├── Attendance
│   └── Pending Leaves
├── Charts Section
│   ├── Department Distribution (Bar Chart)
│   └── Status Distribution (Pie Chart)
└── Recent Activity
    ├── Leave Requests
    └── Quick Actions

Employees.tsx
├── Header
├── Search & Filters
├── Employee Table
│   ├── Table Header
│   └── Table Rows
│       ├── Employee Info
│       └── Action Buttons
├── Add Dialog
├── Edit Dialog
└── Delete Confirmation
```

## 🔐 Role-Based Access Control

### Permission Matrix

| Feature/Page | Admin | HR Manager | Employee |
|--------------|-------|------------|----------|
| Dashboard    | ✅    | ✅         | ✅       |
| Employees    | ✅    | ✅         | ❌       |
| Add Employee | ✅    | ✅         | ❌       |
| Edit Employee| ✅    | ✅         | ❌       |
| Delete Employee| ✅  | ✅         | ❌       |
| Departments  | ✅    | ✅         | ❌       |
| Attendance   | ✅    | ✅         | ✅ (Own) |
| Mark Attendance| ✅  | ✅         | ✅ (Own) |
| Leave Requests| ✅   | ✅         | ✅ (Own) |
| Approve Leaves| ✅   | ✅         | ❌       |
| Payroll      | ✅    | ✅         | ✅ (Own) |
| Generate Payroll| ✅ | ✅         | ❌       |
| Reports      | ✅    | ✅         | ❌       |

### Implementation

```typescript
// useAuth hook provides role checking
const { hasRole, isAdmin, isHRManager, isEmployee } = useAuth();

// Navigation items are filtered based on roles
const filteredNav = navItems.filter((item) => hasRole(item.roles));

// Conditional rendering in components
{isHRManager() && (
  <Button onClick={handleApprove}>Approve</Button>
)}
```

## 📊 State Management Pattern

### Redux Toolkit Slices

**Auth Slice**
- State: user, token, isAuthenticated
- Actions: login(), logout(), updateUser()
- Persistence: LocalStorage

**Employee Slice**
- State: employees[], selectedEmployee, loading
- Actions: addEmployee(), updateEmployee(), deleteEmployee(), selectEmployee()
- Data Source: Mock data

### State Structure

```typescript
{
  auth: {
    user: {
      id: string,
      name: string,
      email: string,
      role: 'admin' | 'hr_manager' | 'employee'
    },
    token: string | null,
    isAuthenticated: boolean
  },
  employees: {
    employees: Employee[],
    selectedEmployee: Employee | null,
    loading: boolean
  }
}
```

## 🎨 UI Component Library

### Shadcn UI Components Used

- **Forms**: Input, Label, Select, Textarea, Checkbox, Radio
- **Data Display**: Table, Card, Badge, Avatar
- **Feedback**: Dialog, Alert, Toast (Sonner)
- **Navigation**: Tabs, Accordion
- **Overlays**: Sheet, Dropdown Menu
- **Charts**: Recharts integration

### Styling Strategy

```
Tailwind CSS v4
├── Utility-first approach
├── Custom theme configuration (/src/styles/theme.css)
├── Component-specific styles
└── Responsive design (mobile-first)
```

## 🔄 API Design (For Future Backend)

### RESTful Endpoints

```
Authentication:
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

Employees:
GET    /api/employees
GET    /api/employees/:id
POST   /api/employees
PUT    /api/employees/:id
DELETE /api/employees/:id

Departments:
GET    /api/departments
POST   /api/departments
PUT    /api/departments/:id
DELETE /api/departments/:id

Attendance:
GET    /api/attendance
GET    /api/attendance/:employeeId
POST   /api/attendance/checkin
POST   /api/attendance/checkout

Leaves:
GET    /api/leaves
GET    /api/leaves/:id
POST   /api/leaves
PUT    /api/leaves/:id/approve
PUT    /api/leaves/:id/reject

Payroll:
GET    /api/payroll
GET    /api/payroll/:employeeId
POST   /api/payroll/generate
GET    /api/payroll/:id/download

Reports:
GET    /api/reports/attendance
GET    /api/reports/payroll
GET    /api/reports/leaves
GET    /api/reports/departments
```

## 🗄️ Database Design (For Production)

### MongoDB Collections

```javascript
// Users Collection
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  role: String,
  employeeId: ObjectId (ref: Employees),
  createdAt: Date,
  updatedAt: Date
}

// Employees Collection
{
  _id: ObjectId,
  employeeId: String (unique),
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  dateOfBirth: Date,
  address: String,
  departmentId: ObjectId (ref: Departments),
  designation: String,
  joinDate: Date,
  basicSalary: Number,
  allowances: Number,
  status: String (enum),
  documents: {
    resume: String (URL),
    idProof: String (URL),
    photo: String (URL)
  },
  createdAt: Date,
  updatedAt: Date
}

// Departments Collection
{
  _id: ObjectId,
  name: String (unique),
  description: String,
  headId: ObjectId (ref: Employees),
  createdAt: Date
}

// Attendance Collection
{
  _id: ObjectId,
  employeeId: ObjectId (ref: Employees),
  date: Date,
  checkIn: Date,
  checkOut: Date,
  workHours: Number,
  status: String (enum),
  notes: String,
  createdAt: Date
}

// Leaves Collection
{
  _id: ObjectId,
  employeeId: ObjectId (ref: Employees),
  leaveType: String (enum),
  startDate: Date,
  endDate: Date,
  days: Number,
  reason: String,
  status: String (enum),
  appliedDate: Date,
  approvedBy: ObjectId (ref: Users),
  approvedDate: Date,
  rejectionReason: String
}

// Payroll Collection
{
  _id: ObjectId,
  employeeId: ObjectId (ref: Employees),
  month: String,
  year: Number,
  basicSalary: Number,
  allowances: Number,
  deductions: Number,
  netSalary: Number,
  paidDate: Date,
  status: String (enum),
  generatedBy: ObjectId (ref: Users),
  createdAt: Date
}
```

## 🔒 Security Architecture

### Authentication

```
1. User Login
2. Server validates credentials
3. Generate JWT token
   - Payload: { userId, role, email }
   - Secret: environment variable
   - Expiry: 24 hours
4. Return token to client
5. Client stores in httpOnly cookie or localStorage
6. Include token in Authorization header for API calls
7. Server validates token on each request
```

### Authorization Middleware

```typescript
// Backend middleware (example)
const authorize = (roles: string[]) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

// Usage
router.get('/employees', 
  authenticate, 
  authorize(['admin', 'hr_manager']), 
  getEmployees
);
```

## 📈 Performance Optimization

### Current Optimizations

1. **Code Splitting**: React.lazy() for route-based splitting
2. **Memoization**: useMemo, useCallback for expensive computations
3. **Virtual Scrolling**: For large employee lists
4. **Debouncing**: Search inputs
5. **Image Optimization**: Lazy loading for employee photos

### Future Optimizations

1. **Backend Caching**: Redis for frequently accessed data
2. **Database Indexing**: On frequently queried fields
3. **Pagination**: Server-side pagination for large datasets
4. **CDN**: Static assets delivery
5. **Compression**: Gzip/Brotli compression

## 🧪 Testing Strategy

### Testing Pyramid

```
                   E2E Tests
                  (Cypress)
                     │
            Integration Tests
         (React Testing Library)
                     │
              Unit Tests
              (Vitest)
```

### Test Coverage Goals

- Unit Tests: 80%+
- Integration Tests: 60%+
- E2E Tests: Critical user flows

## 🚀 Deployment Architecture

### Production Stack

```
Frontend:
- Vercel / Netlify (React SPA)
- CDN for static assets

Backend (Future):
- Node.js + Express on AWS EC2 / Heroku
- MongoDB Atlas (Database)
- Redis (Caching)
- AWS S3 (File storage)

CI/CD:
- GitHub Actions
- Automated testing
- Automated deployment
```

---

**Note**: This is a demonstration system. For production use, implement proper backend, database, and security measures.
