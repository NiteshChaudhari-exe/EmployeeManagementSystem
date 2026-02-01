# 🚀 QUICK START GUIDE - Backend Development

## Getting Started (5 minutes)

### Prerequisites
- Node.js v22+
- MongoDB running locally (or update .env for cloud)
- Visual Studio Code

### Setup Backend

1. **Install dependencies (if not already done)**
   ```bash
   cd backend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   
   Expected output:
   ```
   ✅ Server running on port 5000
   ```

3. **Verify connection**
   ```bash
   curl http://localhost:5000/api/health
   ```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── utils/db.js          ← Database connection
│   ├── models/              ← Mongoose schemas (6 models)
│   ├── services/            ← Business logic (auth service)
│   ├── middleware/          ← Auth & RBAC middleware
│   ├── controllers/         ← Request handlers (5 controllers)
│   ├── routes/              ← API routes (5 route files)
│   └── app.js              ← Express app entry
├── .env                     ← Configuration
├── package.json
└── node_modules/
```

---

## 🔑 Key Files to Know

### Database Connection
**File:** `backend/src/utils/db.js`
- `connectDB()` - Connect to MongoDB
- `disconnectDB()` - Clean disconnect

### Models (Database Schemas)
- `User.js` - User accounts with password hashing
- `Employee.js` - Employee data
- `Department.js` - Department info
- `Attendance.js` - Attendance tracking
- `Leave.js` - Leave requests with approval flow
- `Payroll.js` - Salary calculations

### Authentication
**File:** `backend/src/services/authService.js`
- `generateToken()` - Create JWT
- `verifyToken()` - Validate JWT
- `registerUser()` - Sign up
- `loginUser()` - Sign in

### Security
**File:** `backend/src/middleware/authMiddleware.js`
- `authenticateToken` - Verify JWT on routes
- `authorize()` - Check user role

### Controllers (5 total)
- `authController.js` - Auth endpoints
- `employeeController.js` - Employee CRUD
- `departmentController.js` - Department CRUD
- `attendanceController.js` - Attendance CRUD
- `leaveController.js` - Leave requests
- `payrollController.js` - Payroll management

---

## 🔐 Authentication Flow

### Registration
```
POST /api/auth/register
│
├─ Validate input
├─ Hash password
├─ Save to MongoDB
├─ Generate JWT token
└─ Return token + user
```

### Login
```
POST /api/auth/login
│
├─ Find user
├─ Compare passwords
├─ Generate JWT token
├─ Update lastLogin
└─ Return token + user
```

### Protected Routes
```
GET /api/employees
│
├─ Extract token from header
├─ Verify token signature
├─ Check expiration
├─ Attach user to request
└─ Proceed or return 401/403
```

---

## 📊 Database Schema Overview

### User
```
{
  _id: ObjectId
  email: String (unique, indexed)
  password: String (hashed)
  firstName: String
  lastName: String
  role: admin | hr_manager | employee
  isActive: Boolean
  lastLogin: Date
  timestamps: { createdAt, updatedAt }
}
```

### Employee
```
{
  _id: ObjectId
  userId: ref → User
  employeeId: String (unique)
  position: String
  department: ref → Department
  salary: Number
  joinDate: Date
  phone: String
  address: String
  dateOfBirth: Date
  timestamps
}
```

### Department
```
{
  _id: ObjectId
  name: String (unique)
  description: String
  manager: ref → User
  employeeCount: Number
  budget: Number
  timestamps
}
```

### Attendance
```
{
  _id: ObjectId
  employee: ref → Employee (indexed)
  date: Date (indexed)
  status: present | absent | late | half_day
  checkInTime: Date
  checkOutTime: Date
  notes: String
  timestamps
}
```

### Leave
```
{
  _id: ObjectId
  employee: ref → Employee
  leaveType: sick | casual | earned | unpaid
  startDate: Date
  endDate: Date
  days: Number
  reason: String
  status: pending | approved | rejected
  approvedBy: ref → User
  timestamps
}
```

### Payroll
```
{
  _id: ObjectId
  employee: ref → Employee (indexed)
  month: Date (indexed)
  baseSalary: Number
  bonus: Number
  deductions: Number
  netSalary: Number
  status: pending | processed | paid
  paidDate: Date
  timestamps
}
```

---

## 🔌 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Status Codes
- `200` - OK (GET, PUT)
- `201` - Created (POST)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token)
- `403` - Forbidden (invalid token or role)
- `404` - Not Found
- `500` - Server Error

---

## 🔒 Authorization Levels

### Admin
- Full access to all operations
- Can delete any resource
- Can modify user roles
- Can view all data

### HR Manager
- Can create/update employees
- Can manage departments
- Can log attendance
- Can approve/reject leave
- Can create payroll
- Cannot delete users

### Employee
- Can view own data
- Can request leave
- Can view attendance
- Can view payroll (own only)
- Cannot create/update/delete

---

## 🧪 Quick Testing

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","firstName":"Test","lastName":"User"}'
```

Save the returned `token` value.

### 2. Use Token
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Create Resource
```bash
curl -X POST http://localhost:5000/api/departments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Engineering","budget":500000}'
```

---

## 🛠️ Common Tasks

### Add New Controller
1. Create file: `backend/src/controllers/newController.js`
2. Export functions: `export const getAll = ...`
3. Import in route file: `import * as controller from ...`
4. Add routes to: `backend/src/routes/newRoutes.js`

### Add New Model
1. Create file: `backend/src/models/NewModel.js`
2. Define schema with validation
3. Export: `export default mongoose.model('NewModel', schema)`
4. Import in controllers when needed

### Protect Route with Authorization
```javascript
router.post('/sensitive', authorize('admin'), controller.action);
```

### Add Validation
```javascript
if (!email || !password) {
  return res.status(400).json({
    success: false,
    message: 'Missing required fields'
  });
}
```

---

## 🐛 Debugging

### Check Server Logs
- Server startup: `✅ Server running on port 5000`
- Database connection: `✅ MongoDB Connected: localhost`
- Errors: Red error messages with stack trace

### Test MongoDB
```bash
# In new terminal:
mongosh
use ems
db.users.find()
```

### Decode JWT Token
Visit https://jwt.io and paste token to see payload

### Enable More Logging
Add `console.log()` statements in controllers:
```javascript
console.log('User:', req.user);
console.log('Incoming data:', req.body);
```

---

## 📝 Environment Variables

Located in `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/ems

# JWT
JWT_SECRET=dev_secret_key_not_for_production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Update for Production
- Change `JWT_SECRET` to strong random string
- Update `DATABASE_URL` for cloud MongoDB
- Set `NODE_ENV=production`
- Update `CORS_ORIGIN` to frontend domain

---

## 🚨 Common Errors

### "Port already in use"
```bash
# Kill existing process
Stop-Process -Name node -Force

# Then restart
npm run dev
```

### "MongoDB connection failed"
```bash
# Check MongoDB is running
# If using local: mongod --dbpath /data/db
# If using cloud: Update DATABASE_URL in .env
```

### "Token invalid or expired"
- Token may have expired (check JWT_EXPIRES_IN)
- Regenerate with new login
- Check token format: `Bearer ACTUAL_TOKEN`

### "Cannot find module"
```bash
# Reinstall dependencies
npm install

# Clear npm cache if persistent
npm cache clean --force
npm install
```

---

## 📚 Documentation Files

1. **API_TESTING_GUIDE.md** - Detailed curl examples
2. **WEEK2_COMPLETION_SUMMARY.md** - Complete feature overview
3. **WEEK2_IMPLEMENTATION_GUIDE.md** - Technical specifications

---

## ⏭️ Next Steps

**Week 3 Tasks:**
1. Connect frontend Login to `/api/auth/login`
2. Store JWT in Redux
3. Add authorization header to all requests
4. Build Employee list UI connected to `/api/employees`
5. Add Create/Edit Employee forms
6. Connect Department, Attendance, Leave UIs

---

## 💡 Pro Tips

✅ **Always test with Postman/Insomnia** - Easier than curl
✅ **Save API tokens** in Postman environment variables
✅ **Check MongoDB** when debugging CRUD issues
✅ **Use middleware order carefully** - `app.use(authMiddleware)` affects all after it
✅ **Populate references** when querying (see controllers for examples)
✅ **Test with different roles** - Verify authorization works

---

## 🎯 Development Workflow

1. **Start server** - `npm run dev`
2. **Create/test endpoint** - Use Postman
3. **Check MongoDB** - Verify data saved
4. **Commit changes** - `git add -A && git commit -m "..."`
5. **Document changes** - Update this guide if needed

---

**Last Updated:** February 1, 2026  
**Backend Version:** Week 2 Complete  
**Ready to Develop:** ✅ YES
