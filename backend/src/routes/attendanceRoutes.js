import express from 'express';
import * as attendanceController from '../controllers/attendanceController.js';
import { authenticateToken, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes protected by authentication
router.use(authenticateToken);

router.get('/', attendanceController.getAllAttendance);
router.post('/', authorize('admin', 'hr_manager'), attendanceController.createAttendance);
router.get('/:id', attendanceController.getAttendance);
router.put('/:id', authorize('admin', 'hr_manager'), attendanceController.updateAttendance);
router.delete('/:id', authorize('admin'), attendanceController.deleteAttendance);

export default router;
