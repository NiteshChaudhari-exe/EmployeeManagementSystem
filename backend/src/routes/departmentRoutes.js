import express from 'express';
import * as departmentController from '../controllers/departmentController.js';
import { authenticateToken, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes protected by authentication
router.use(authenticateToken);

router.get('/', departmentController.getAllDepartments);
router.post('/', authorize('admin', 'hr_manager'), departmentController.createDepartment);
router.get('/:id', departmentController.getDepartment);
router.put('/:id', authorize('admin', 'hr_manager'), departmentController.updateDepartment);
router.delete('/:id', authorize('admin'), departmentController.deleteDepartment);

export default router;
