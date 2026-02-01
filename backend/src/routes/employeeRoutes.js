import express from 'express';
import * as employeeController from '../controllers/employeeController.js';
import { authenticateToken, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes protected by authentication
router.use(authenticateToken);

router.get('/', employeeController.getAllEmployees);
router.post('/', authorize('admin', 'hr_manager'), employeeController.createEmployee);
router.get('/:id', employeeController.getEmployee);
router.put('/:id', authorize('admin', 'hr_manager'), employeeController.updateEmployee);
router.delete('/:id', authorize('admin'), employeeController.deleteEmployee);

export default router;
