import express from "express";
import upload, { handleUploadError, validateFileUpload } from "../middleware/uploadMiddleware.js";
import {
  uploadFile,
  getDocuments,
  getUserDocuments,
  downloadDocument,
  deleteDocument,
  batchDeleteDocuments,
  getDocumentById,
} from "../controllers/uploadController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Upload a file
router.post("/", upload.single("file"), handleUploadError, validateFileUpload, uploadFile);

// Get documents for a specific resource
router.get("/resource", getDocuments);

// Get all documents uploaded by current user
router.get("/my-documents", getUserDocuments);

// Get document by ID
router.get("/:id", getDocumentById);

// Download document
router.get("/:id/download", downloadDocument);

// Delete single document
router.delete("/:id", deleteDocument);

// Batch delete documents
router.post("/batch-delete", batchDeleteDocuments);

export default router;
