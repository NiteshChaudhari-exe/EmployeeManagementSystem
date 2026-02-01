# 🧪 WEEK 2 API Testing Guide

## Backend Server Status
- **URL:** http://localhost:5000
- **Status:** ✅ Running
- **Database:** MongoDB (localhost:27017/ems)
- **Authentication:** JWT Bearer Tokens

---

## 1️⃣ Authentication Endpoints

### Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "admin@example.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "employee"
    }
  }
}
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 2️⃣ Employee Endpoints

### Get All Employees
```bash
curl -X GET http://localhost:5000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Employee (HR Manager+)
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "userId": "507f1f77bcf86cd799439011",
    "employeeId": "EMP001",
    "position": "Senior Developer",
    "department": "507f1f77bcf86cd799439012",
    "salary": 75000,
    "joinDate": "2024-01-15"
  }'
```

### Get Single Employee
```bash
curl -X GET http://localhost:5000/api/employees/EMPLOYEE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Employee (HR Manager+)
```bash
curl -X PUT http://localhost:5000/api/employees/EMPLOYEE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "position": "Lead Developer",
    "salary": 85000
  }'
```

### Delete Employee (Admin only)
```bash
curl -X DELETE http://localhost:5000/api/employees/EMPLOYEE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 3️⃣ Department Endpoints

### Get All Departments
```bash
curl -X GET http://localhost:5000/api/departments \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Department (HR Manager+)
```bash
curl -X POST http://localhost:5000/api/departments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Engineering",
    "description": "Software Development",
    "budget": 500000
  }'
```

### Get Single Department
```bash
curl -X GET http://localhost:5000/api/departments/DEPT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Department (HR Manager+)
```bash
curl -X PUT http://localhost:5000/api/departments/DEPT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "budget": 600000,
    "manager": "507f1f77bcf86cd799439011"
  }'
```

### Delete Department (Admin only)
```bash
curl -X DELETE http://localhost:5000/api/departments/DEPT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 4️⃣ Attendance Endpoints

### Get All Attendance Records
```bash
curl -X GET http://localhost:5000/api/attendance \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Attendance Record (HR Manager+)
```bash
curl -X POST http://localhost:5000/api/attendance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "employee": "507f1f77bcf86cd799439013",
    "date": "2024-01-15",
    "status": "present",
    "checkInTime": "2024-01-15T09:00:00Z"
  }'
```

### Get Single Attendance Record
```bash
curl -X GET http://localhost:5000/api/attendance/RECORD_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Attendance Record (HR Manager+)
```bash
curl -X PUT http://localhost:5000/api/attendance/RECORD_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "status": "late",
    "notes": "Morning traffic"
  }'
```

---

## 5️⃣ Leave Endpoints

### Get All Leave Requests
```bash
curl -X GET http://localhost:5000/api/leaves \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Leave Request
```bash
curl -X POST http://localhost:5000/api/leaves \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "employee": "507f1f77bcf86cd799439013",
    "leaveType": "casual",
    "startDate": "2024-02-01",
    "endDate": "2024-02-03",
    "days": 3,
    "reason": "Family visit"
  }'
```

### Approve Leave Request (HR Manager+)
```bash
curl -X POST http://localhost:5000/api/leaves/LEAVE_ID/approve \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Reject Leave Request (HR Manager+)
```bash
curl -X POST http://localhost:5000/api/leaves/LEAVE_ID/reject \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 6️⃣ Payroll Endpoints

### Get All Payroll Records
```bash
curl -X GET http://localhost:5000/api/payroll \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Payroll Record (HR Manager+)
```bash
curl -X POST http://localhost:5000/api/payroll \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "employee": "507f1f77bcf86cd799439013",
    "month": "2024-01-01",
    "baseSalary": 75000,
    "bonus": 5000,
    "deductions": 2000,
    "netSalary": 78000
  }'
```

### Get Single Payroll Record
```bash
curl -X GET http://localhost:5000/api/payroll/PAYROLL_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Payroll Record (HR Manager+)
```bash
curl -X PUT http://localhost:5000/api/payroll/PAYROLL_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "status": "paid",
    "paidDate": "2024-02-01T10:00:00Z"
  }'
```

---

## 🔐 Role-Based Access Control

### Roles & Permissions

| Role | Register | Login | View | Create | Update | Delete | Approve |
|------|----------|-------|------|--------|--------|--------|---------|
| Anonymous | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Employee | - | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| HR Manager | - | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Admin | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## ⚠️ Error Responses

### Authentication Error (401)
```json
{
  "success": false,
  "message": "No authentication token provided"
}
```

### Authorization Error (403)
```json
{
  "success": false,
  "message": "You do not have permission to access this resource"
}
```

### Validation Error (400)
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Employee not found"
}
```

---

## 💡 Tips for Testing

1. **Use Postman or Insomnia** for easier testing with saved headers
2. **Save your JWT token** after login for repeated requests
3. **Test with different roles** to verify authorization
4. **Check MongoDB** to verify data is actually stored
5. **Monitor server logs** for debugging

---

## 🚀 Quick Test Sequence

1. **Register a new admin user**
   ```bash
   POST /api/auth/register
   ```

2. **Login and save token**
   ```bash
   POST /api/auth/login
   ```

3. **Create a department**
   ```bash
   POST /api/departments
   ```

4. **Create an employee**
   ```bash
   POST /api/employees
   ```

5. **Log attendance**
   ```bash
   POST /api/attendance
   ```

6. **Request leave**
   ```bash
   POST /api/leaves
   ```

7. **Create payroll**
   ```bash
   POST /api/payroll
   ```

---

## 📝 Sample Test Data

### Test Credentials
```json
{
  "email": "test@example.com",
  "password": "test123456",
  "firstName": "Test",
  "lastName": "User"
}
```

### Sample Employee
```json
{
  "employeeId": "EMP001",
  "position": "Software Engineer",
  "salary": 70000,
  "joinDate": "2024-01-15",
  "phone": "+1-555-0123",
  "address": "123 Main St, City"
}
```

### Sample Department
```json
{
  "name": "IT Department",
  "description": "Information Technology",
  "budget": 500000
}
```

---

## 🔍 Debugging

### Check if server is running
```bash
curl http://localhost:5000/api/health
```

### View MongoDB connection
Check server logs for: `✅ MongoDB Connected: localhost`

### Verify JWT token
Visit https://jwt.io and paste your token to decode it

### Check user role
Decode your JWT token - look for `role` field

---

**Last Updated:** February 1, 2026  
**Backend Version:** Week 2 Complete  
**Status:** Ready for Testing ✅
