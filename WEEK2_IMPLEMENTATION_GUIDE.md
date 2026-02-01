# 🛠️ WEEK 2 IMPLEMENTATION GUIDE - Backend Database & API Foundation

**Date:** February 1, 2026  
**Phase:** 2 of 5  
**Duration:** 16-20 hours  
**Owner:** Backend Development Team

---

## Overview

Week 2 focuses on establishing the backend foundation: database setup, models, authentication service, and middleware infrastructure. This provides the backbone for all API endpoints that will be implemented in Week 3.

---

## Technology Decisions

### Database: MongoDB vs PostgreSQL

#### **MongoDB** (Recommended for this project)
✅ **Pros:**
- Flexible schema matches our TypeScript interfaces
- Easier NoSQL CRUD operations
- Great with Node.js/Express
- Mongoose provides excellent schema validation
- Good for rapid development

❌ **Cons:**
- Slightly larger storage overhead
- Transaction support more complex

#### **PostgreSQL** (Alternative)
✅ **Pros:**
- ACID compliance for enterprise
- Better relational data integrity
- Mature and stable

❌ **Cons:**
- More migration planning needed
- More verbose schema setup

**Decision:** MongoDB with Mongoose ODM (recommended for this phase)

---

## Task 1: Database Setup & Connection

### 1.1 Install Dependencies

```bash
cd backend
npm install mongoose
npm install dotenv
```

### 1.2 Update backend/.env

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/ems
# Mongo Atlas example:
# DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/ems?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=info
```

### 1.3 Create Database Connection File

**File:** `backend/src/utils/db.js`

```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB Disconnected');
  } catch (error) {
    console.error(`❌ Error disconnecting: ${error.message}`);
  }
};
```

### 1.4 Update backend/src/app.js to Connect DB

```javascript
import express from 'express';
import cors from 'cors';
import { connectDB } from './utils/db.js';
import { API_ROUTES } from './config/constants.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import payrollRoutes from './routes/payrollRoutes.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Routes
app.use(API_ROUTES.AUTH, authRoutes);
app.use(API_ROUTES.EMPLOYEES, employeeRoutes);
app.use(API_ROUTES.DEPARTMENTS, departmentRoutes);
app.use(API_ROUTES.ATTENDANCE, attendanceRoutes);
app.use(API_ROUTES.LEAVES, leaveRoutes);
app.use(API_ROUTES.PAYROLL, payrollRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
```

### 1.5 Test Database Connection

```bash
npm run dev
# Should see: ✅ MongoDB Connected: [host]
```

---

## Task 2: Implement Database Models

### 2.1 User Model

**File:** `backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    firstName: {
      type: String,
      required: [true, 'Please provide first name'],
    },
    lastName: {
      type: String,
      required: [true, 'Please provide last name'],
    },
    role: {
      type: String,
      enum: ['admin', 'hr_manager', 'employee'],
      default: 'employee',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
```

### 2.2 Employee Model

**File:** `backend/src/models/Employee.js`

```javascript
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    position: {
      type: String,
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    joinDate: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Employee', employeeSchema);
```

### 2.3 Department Model

**File:** `backend/src/models/Department.js`

```javascript
import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide department name'],
      unique: true,
    },
    description: {
      type: String,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    employeeCount: {
      type: Number,
      default: 0,
    },
    budget: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Department', departmentSchema);
```

### 2.4 Attendance Model

**File:** `backend/src/models/Attendance.js`

```javascript
import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'half_day'],
      required: true,
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create index for efficient queries
attendanceSchema.index({ employee: 1, date: 1 });

export default mongoose.model('Attendance', attendanceSchema);
```

### 2.5 Leave Model

**File:** `backend/src/models/Leave.js`

```javascript
import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    leaveType: {
      type: String,
      enum: ['sick', 'casual', 'earned', 'unpaid'],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Leave', leaveSchema);
```

### 2.6 Payroll Model

**File:** `backend/src/models/Payroll.js`

```javascript
import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    month: {
      type: Date,
      required: true,
    },
    baseSalary: {
      type: Number,
      required: true,
    },
    bonus: {
      type: Number,
      default: 0,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    netSalary: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processed', 'paid'],
      default: 'pending',
    },
    processedDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Create index for efficient queries
payrollSchema.index({ employee: 1, month: 1 });

export default mongoose.model('Payroll', payrollSchema);
```

---

## Task 3: Authentication Service

**File:** `backend/src/services/authService.js`

```javascript
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const registerUser = async (email, password, firstName, lastName) => {
  // Check if user exists
  let user = await User.findOne({ email });
  if (user) {
    throw new Error('User already exists with that email');
  }

  // Create new user
  user = await User.create({
    email,
    password,
    firstName,
    lastName,
  });

  // Generate token
  const token = generateToken(user._id, user.role);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
};

export const loginUser = async (email, password) => {
  // Validate email & password
  if (!email || !password) {
    throw new Error('Please provide email and password');
  }

  // Check for user (include password in query)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id, user.role);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
};
```

---

## Task 4: Middleware Implementation

### 4.1 Authentication Middleware

**File:** `backend/src/middleware/authMiddleware.js`

```javascript
import { verifyToken } from '../services/authService.js';

export const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message,
    });
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource',
      });
    }
    next();
  };
};
```

---

## Task 5: Auth Endpoints

**File:** `backend/src/controllers/authController.js`

```javascript
import * as authService from '../services/authService.js';

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const result = await authService.registerUser(email, password, firstName, lastName);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const result = await authService.loginUser(email, password);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
```

**File:** `backend/src/routes/authRoutes.js`

```javascript
import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticateToken, authController.getCurrentUser);

export default router;
```

---

## Task 6: Resource Controllers (CRUD)

### 6.1 Employee Controller

**File:** `backend/src/controllers/employeeController.js`

```javascript
import Employee from '../models/Employee.js';
import User from '../models/User.js';

// Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate('userId', 'email firstName lastName')
      .populate('department', 'name');
    
    res.json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single employee
export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('userId')
      .populate('department');
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create employee
export const createEmployee = async (req, res) => {
  try {
    const { userId, employeeId, position, department, salary, joinDate } = req.body;

    // Validation
    if (!userId || !employeeId || !position || !department || !salary) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const employee = await Employee.create({
      userId,
      employeeId,
      position,
      department,
      salary,
      joinDate,
    });

    res.status(201).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update employee
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

**File:** `backend/src/routes/employeeRoutes.js`

```javascript
import express from 'express';
import * as employeeController from '../controllers/employeeController.js';
import { authenticateToken, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes with authentication
router.use(authenticateToken);

// Public (all authenticated users can read)
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployee);

// Admin only
router.post('/', authorize('admin', 'hr_manager'), employeeController.createEmployee);
router.put('/:id', authorize('admin', 'hr_manager'), employeeController.updateEmployee);
router.delete('/:id', authorize('admin'), employeeController.deleteEmployee);

export default router;
```

---

## Testing the Backend

### Test Database Connection
```bash
npm run dev
# Should see: ✅ MongoDB Connected
```

### Test Health Endpoint
```bash
curl http://localhost:5000/api/health
# Expected: {"status":"ok","message":"Server is running"}
```

### Test Auth Endpoints (using Postman/Thunder Client)

**Register:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123",
  "firstName": "Admin",
  "lastName": "User"
}
```

**Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

---

## Validation Checklist

- [ ] MongoDB/Mongoose installed
- [ ] Database connection working
- [ ] All 6 models created and validated
- [ ] Authentication service implemented
- [ ] Auth middleware working
- [ ] Auth endpoints tested (register/login)
- [ ] Role-based access control verified
- [ ] CORS configured
- [ ] Error handling in place
- [ ] All tests passing (backend unit tests)

---

## Success Criteria

✅ Database connection established  
✅ All 6 models created with proper schema  
✅ JWT authentication working  
✅ Middleware protecting endpoints  
✅ CRUD operations ready for all resources  
✅ Password hashing implemented  
✅ Role-based access control functional  
✅ Error handling comprehensive  

---

## Next Steps (Week 3)

- Implement complete CRUD for remaining 5 resources
- Add validation and error handling
- Create API integration tests
- Setup request/response logging

---

**Estimated Time:** 16-20 hours  
**Ready:** Yes - Proceed with implementation
