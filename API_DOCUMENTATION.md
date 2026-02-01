# API Documentation

## Employee Management System - REST API Specification

**Base URL**: `http://localhost:3000/api`

**Authentication**: JWT Bearer Token

---

## Authentication Endpoints

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@company.com",
  "password": "securepassword"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-001",
      "name": "John Doe",
      "email": "user@company.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Logout
```http
POST /auth/logout
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Get Current User
```http
GET /auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "user-001",
    "name": "John Doe",
    "email": "user@company.com",
    "role": "admin"
  }
}
```

---

## Employee Endpoints

### Get All Employees
```http
GET /employees
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term
- `department` (optional): Filter by department ID
- `status` (optional): Filter by status (active, resigned, terminated)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "employees": [
      {
        "id": "emp-001",
        "employeeId": "EMP001",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@company.com",
        "phone": "+1-234-567-8900",
        "dateOfBirth": "1990-05-15",
        "address": "123 Main St, New York, NY",
        "departmentId": "dept-001",
        "designation": "Senior Software Engineer",
        "joinDate": "2020-01-15",
        "basicSalary": 75000,
        "allowances": 15000,
        "status": "active",
        "createdAt": "2020-01-15T00:00:00Z",
        "updatedAt": "2024-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "pages": 5
    }
  }
}
```

### Get Employee by ID
```http
GET /employees/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "emp-001",
    "employeeId": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    // ... all employee fields
  }
}
```

### Create Employee
```http
POST /employees
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@company.com",
  "phone": "+1-234-567-8901",
  "dateOfBirth": "1992-03-20",
  "address": "456 Oak Ave, Los Angeles, CA",
  "departmentId": "dept-002",
  "designation": "HR Manager",
  "joinDate": "2024-01-15",
  "basicSalary": 70000,
  "allowances": 12000,
  "status": "active"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": "emp-new",
    "employeeId": "EMP051",
    // ... all employee fields
  }
}
```

### Update Employee
```http
PUT /employees/:id
```

**Request Body:**
```json
{
  "designation": "Senior HR Manager",
  "basicSalary": 75000,
  "status": "active"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {
    "id": "emp-001",
    // ... updated employee fields
  }
}
```

### Delete Employee
```http
DELETE /employees/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

---

## Department Endpoints

### Get All Departments
```http
GET /departments
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "dept-001",
      "name": "Engineering",
      "description": "Software development and technical operations",
      "headId": "emp-001",
      "employeeCount": 15,
      "createdAt": "2018-01-01T00:00:00Z"
    }
  ]
}
```

### Create Department
```http
POST /departments
```

**Request Body:**
```json
{
  "name": "Customer Support",
  "description": "Customer service and support operations",
  "headId": "emp-015"
}
```

### Update Department
```http
PUT /departments/:id
```

### Delete Department
```http
DELETE /departments/:id
```

---

## Attendance Endpoints

### Get Attendance Records
```http
GET /attendance
```

**Query Parameters:**
- `employeeId` (optional): Filter by employee
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)
- `status` (optional): Filter by status

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "att-001",
      "employeeId": "emp-001",
      "date": "2026-01-29",
      "checkIn": "09:00:00",
      "checkOut": "18:00:00",
      "workHours": 9,
      "status": "present",
      "notes": ""
    }
  ]
}
```

### Check In
```http
POST /attendance/checkin
```

**Request Body:**
```json
{
  "employeeId": "emp-001",
  "checkIn": "2026-01-29T09:00:00Z"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Checked in successfully",
  "data": {
    "id": "att-new",
    "employeeId": "emp-001",
    "date": "2026-01-29",
    "checkIn": "09:00:00",
    "status": "present"
  }
}
```

### Check Out
```http
POST /attendance/checkout
```

**Request Body:**
```json
{
  "attendanceId": "att-001",
  "checkOut": "2026-01-29T18:00:00Z"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Checked out successfully",
  "data": {
    "id": "att-001",
    "checkOut": "18:00:00",
    "workHours": 9
  }
}
```

---

## Leave Endpoints

### Get Leave Requests
```http
GET /leaves
```

**Query Parameters:**
- `employeeId` (optional)
- `status` (optional): pending, approved, rejected
- `startDate` (optional)
- `endDate` (optional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "leave-001",
      "employeeId": "emp-001",
      "leaveType": "annual",
      "startDate": "2026-02-10",
      "endDate": "2026-02-14",
      "days": 5,
      "reason": "Family vacation",
      "status": "pending",
      "appliedDate": "2026-01-25T10:00:00Z"
    }
  ]
}
```

### Apply for Leave
```http
POST /leaves
```

**Request Body:**
```json
{
  "employeeId": "emp-001",
  "leaveType": "sick",
  "startDate": "2026-02-01",
  "endDate": "2026-02-02",
  "reason": "Medical checkup"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Leave request submitted successfully",
  "data": {
    "id": "leave-new",
    "employeeId": "emp-001",
    "leaveType": "sick",
    "days": 2,
    "status": "pending"
  }
}
```

### Approve Leave
```http
PUT /leaves/:id/approve
```

**Request Body:**
```json
{
  "approvedBy": "user-002"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Leave approved successfully",
  "data": {
    "id": "leave-001",
    "status": "approved",
    "approvedBy": "user-002",
    "approvedDate": "2026-01-26T10:00:00Z"
  }
}
```

### Reject Leave
```http
PUT /leaves/:id/reject
```

**Request Body:**
```json
{
  "rejectedBy": "user-002",
  "rejectionReason": "Insufficient leave balance"
}
```

### Get Leave Balance
```http
GET /leaves/balance/:employeeId
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "employeeId": "emp-001",
    "sick": 10,
    "casual": 12,
    "annual": 15,
    "maternity": 90,
    "paternity": 15
  }
}
```

---

## Payroll Endpoints

### Get Payroll Records
```http
GET /payroll
```

**Query Parameters:**
- `employeeId` (optional)
- `month` (optional)
- `year` (optional)
- `status` (optional): pending, paid

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "pay-001",
      "employeeId": "emp-001",
      "month": "January",
      "year": 2026,
      "basicSalary": 75000,
      "allowances": 15000,
      "deductions": 9000,
      "netSalary": 81000,
      "status": "paid",
      "paidDate": "2026-02-01T00:00:00Z"
    }
  ]
}
```

### Generate Payroll
```http
POST /payroll/generate
```

**Request Body:**
```json
{
  "month": "January",
  "year": 2026,
  "employeeIds": ["emp-001", "emp-002", "emp-003"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Payroll generated successfully",
  "data": {
    "totalRecords": 3,
    "totalAmount": 240000,
    "records": [
      // ... payroll records
    ]
  }
}
```

### Download Payslip
```http
GET /payroll/:id/download
```

**Response (200 OK):**
```
PDF file download
```

---

## Report Endpoints

### Attendance Report
```http
GET /reports/attendance
```

**Query Parameters:**
- `startDate` (required)
- `endDate` (required)
- `departmentId` (optional)
- `format` (optional): json, pdf, excel

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2026-01-01",
      "end": "2026-01-31"
    },
    "summary": {
      "totalEmployees": 50,
      "averageAttendance": 92.5,
      "totalWorkHours": 8450
    },
    "details": [
      {
        "employeeId": "emp-001",
        "name": "John Doe",
        "present": 21,
        "absent": 1,
        "leaves": 1,
        "totalHours": 189
      }
    ]
  }
}
```

### Payroll Report
```http
GET /reports/payroll
```

**Query Parameters:**
- `month` (required)
- `year` (required)
- `departmentId` (optional)

### Leave Report
```http
GET /reports/leaves
```

### Department Report
```http
GET /reports/departments
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

## Rate Limiting

- **Default**: 100 requests per 15 minutes per IP
- **Authenticated**: 1000 requests per 15 minutes per user
- **Headers**:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

---

## WebSocket Events (Future Enhancement)

### Connection
```javascript
const socket = io('http://localhost:3000', {
  auth: { token: 'jwt-token' }
});
```

### Events

**Attendance Updates**
```javascript
socket.on('attendance:update', (data) => {
  // Handle real-time attendance updates
});
```

**Leave Notifications**
```javascript
socket.on('leave:approved', (data) => {
  // Handle leave approval notification
});
```

**Payroll Notifications**
```javascript
socket.on('payroll:generated', (data) => {
  // Handle payroll generation notification
});
```

---

## Postman Collection

Import this collection for testing:

```json
{
  "info": {
    "name": "Employee Management System API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@company.com\",\n  \"password\": \"password\"\n}"
            }
          }
        }
      ]
    }
  ]
}
```

---

**API Version**: 1.0.0  
**Last Updated**: January 29, 2026
