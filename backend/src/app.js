import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './utils/db.js';
import { validateEnv } from './utils/validateEnv.js';

// Validate environment variables before starting
validateEnv();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

import employeeRoutes from './routes/employeeRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import payrollRoutes from './routes/payrollRoutes.js';
import authRoutes from './routes/authRoutes.js';

app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

export default app;
