import React, { useState, useRef } from "react";
import { Upload, X, File, Download, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { toast } from "sonner";

interface Document {
  _id: string;
  fileName: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  downloadCount: number;
}

interface FileUploadProps {
  resourceType: string;
  resourceId: string;
  onUploadSuccess?: () => void;
  allowedTypes?: string[];
  maxSize?: number; // in MB
  description?: string;
}

export default function FileUpload({
  resourceType,
  resourceId,
  onUploadSuccess,
  allowedTypes = ["image/jpeg", "image/png", "application/pdf"],
  maxSize = 50,
  description,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);

  // Fetch documents for this resource
  const fetchDocuments = async () => {
    setIsLoadingDocs(true);
    try {
      const response = await fetch(
        `/api/documents/resource?resourceType=${resourceType}&resourceId=${resourceId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setDocuments(data.data);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  React.useEffect(() => {
    fetchDocuments();
  }, [resourceType, resourceId]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      toast.error(`File type not allowed. Allowed types: ${allowedTypes.join(", ")}`);
      return false;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSize}MB limit`);
      return false;
    }

    return true;
  };

  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("resourceType", resourceType);
    formData.append("resourceId", resourceId);
    if (description) {
      formData.append("description", description);
    }

    try {
      const xhr = new XMLHttpRequest();

      // Progress tracking
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      // Upload completion
      xhr.addEventListener("load", () => {
        if (xhr.status === 201) {
          const response = JSON.parse(xhr.responseText);
          setDocuments([response.data, ...documents]);
          toast.success("File uploaded successfully");
          if (onUploadSuccess) {
            onUploadSuccess();
          }
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          const error = JSON.parse(xhr.responseText);
          toast.error(error.message || "Upload failed");
        }
        setIsUploading(false);
        setUploadProgress(0);
      });

      xhr.addEventListener("error", () => {
        toast.error("Upload failed");
        setIsUploading(false);
        setUploadProgress(0);
      });

      xhr.open("POST", "/api/documents");
      xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem("token")}`);
      xhr.send(formData);
    } catch (error) {
      toast.error("Upload failed");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const response = await fetch(`/api/documents/${docId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setDocuments(documents.filter((doc) => doc._id !== docId));
        toast.success("File deleted successfully");
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleDownload = (docId: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = `/api/documents/${docId}/download`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Attachments</CardTitle>
        <CardDescription>Upload and manage documents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragging
              ? "border-blue-400 bg-blue-50 dark:bg-blue-950"
              : "border-gray-300 dark:border-gray-600"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
            accept={allowedTypes.join(",")}
          />

          <div className="flex flex-col items-center justify-center gap-3">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-medium">
                {isUploading ? "Uploading..." : "Drag and drop your file here"}
              </p>
              <p className="text-xs text-gray-500 mt-1">or</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="mt-2"
              >
                Choose File
              </Button>
            </div>
          </div>

          {isUploading && (
            <div className="mt-4 space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-center text-gray-500">{Math.round(uploadProgress)}%</p>
            </div>
          )}
        </div>

        {/* Uploaded Documents */}
        <div>
          <h4 className="text-sm font-medium mb-3">Uploaded Files ({documents.length})</h4>
          {isLoadingDocs ? (
            <p className="text-sm text-gray-500">Loading documents...</p>
          ) : documents.length === 0 ? (
            <p className="text-sm text-gray-500">No documents uploaded yet</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <File className="h-4 w-4 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.originalFileName}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(doc.fileSize)} • {formatDate(doc.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(doc._id, doc.originalFileName)}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(doc._id)}
                      title="Delete"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
