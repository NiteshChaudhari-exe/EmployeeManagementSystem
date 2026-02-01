import express from 'express';
import * as payrollController from '../controllers/payrollController.js';
import { authenticateToken, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes protected by authentication
router.use(authenticateToken);

router.get('/', payrollController.getAllPayroll);
router.post('/', authorize('admin', 'hr_manager'), payrollController.createPayroll);
router.get('/:id', payrollController.getPayroll);
router.put('/:id', authorize('admin', 'hr_manager'), payrollController.updatePayroll);
router.delete('/:id', authorize('admin'), payrollController.deletePayroll);
router.post('/generate', authorize('admin', 'hr_manager'), payrollController.generatePayroll);

export default router;
