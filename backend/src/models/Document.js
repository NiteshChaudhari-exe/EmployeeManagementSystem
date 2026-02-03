import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
      enum: ["image/jpeg", "image/png", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    },
    fileSize: {
      type: Number,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    associatedResource: {
      resourceType: {
        type: String,
        enum: ["employee", "leave", "payroll", "department", "general"],
        required: true,
      },
      resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    },
    description: {
      type: String,
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
documentSchema.index({ uploadedBy: 1, createdAt: -1 });
documentSchema.index({ "associatedResource.resourceType": 1, "associatedResource.resourceId": 1 });
documentSchema.index({ createdAt: -1 });

const Document = mongoose.model("Document", documentSchema);

export default Document;
