import Document from "../models/Document.js";
import fs from "fs";
import path from "path";

// Upload a file
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    const { resourceType, resourceId, description } = req.body;

    // Validate required fields
    if (!resourceType || !resourceId) {
      // Clean up file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "resourceType and resourceId are required",
      });
    }

    // Create document record
    const document = new Document({
      fileName: req.file.filename,
      originalFileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      filePath: req.file.path,
      uploadedBy: req.user._id,
      associatedResource: {
        resourceType,
        resourceId,
      },
      description: description || "",
      isPublic: false,
    });

    await document.save();

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: document,
    });
  } catch (error) {
    // Clean up file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get documents for a resource
export const getDocuments = async (req, res) => {
  try {
    const { resourceType, resourceId } = req.query;

    if (!resourceType || !resourceId) {
      return res.status(400).json({
        success: false,
        message: "resourceType and resourceId are required",
      });
    }

    const documents = await Document.find({
      "associatedResource.resourceType": resourceType,
      "associatedResource.resourceId": resourceId,
    })
      .populate("uploadedBy", "firstName lastName email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all documents for logged-in user
export const getUserDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      uploadedBy: req.user._id,
    })
      .populate("uploadedBy", "firstName lastName email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Download document
export const downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findByIdAndUpdate(
      id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Check file exists
    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server",
      });
    }

    // Download file
    res.download(document.filePath, document.originalFileName);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete document
export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Check authorization
    if (document.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this document",
      });
    }

    // Delete file from storage
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    // Delete document from database
    await Document.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Batch delete documents
export const batchDeleteDocuments = async (req, res) => {
  try {
    const { documentIds } = req.body;

    if (!Array.isArray(documentIds) || documentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "documentIds must be a non-empty array",
      });
    }

    // Get all documents
    const documents = await Document.find({
      _id: { $in: documentIds },
    });

    // Check authorization and delete files
    for (const document of documents) {
      if (document.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: `Not authorized to delete document ${document._id}`,
        });
      }

      if (fs.existsSync(document.filePath)) {
        fs.unlinkSync(document.filePath);
      }
    }

    // Delete documents from database
    const result = await Document.deleteMany({
      _id: { $in: documentIds },
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} documents deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get document by ID
export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id).populate("uploadedBy", "firstName lastName email");

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
