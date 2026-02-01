import express from 'express';
import * as leaveController from '../controllers/leaveController.js';
import { authenticateToken, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes protected by authentication
router.use(authenticateToken);

router.get('/', leaveController.getAllLeaves);
router.post('/', leaveController.createLeave);
router.get('/:id', leaveController.getLeave);
router.put('/:id', leaveController.updateLeave);
router.delete('/:id', authorize('admin'), leaveController.deleteLeave);
router.post('/:id/approve', authorize('admin', 'hr_manager'), leaveController.approveLeave);
router.post('/:id/reject', authorize('admin', 'hr_manager'), leaveController.rejectLeave);

export default router;
