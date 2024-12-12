import React, { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FileUploaderProps {
  onUpload: (file: File, folderId: string) => Promise<void>;
  currentFolderId: string;
}

export function FileUploader({ onUpload, currentFolderId }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png'
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    if (!allowedTypes.includes(file.type)) {
      setError('File type not supported');
      return false;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size exceeds 10MB limit');
      return false;
    }

    return true;
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    if (!file || !validateFile(file)) return;

    await uploadFile(file);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file || !validateFile(file)) return;

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      await onUpload(file, currentFolderId);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-gray-400",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
          accept={allowedTypes.join(',')}
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <p className="text-sm text-gray-500">Uploading file...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-500">
              Drag and drop a file here, or click to select
            </p>
            <p className="text-xs text-gray-400">
              Supported formats: PDF, Word, Excel, PowerPoint, Images (PNG, JPG)
            </p>
            <p className="text-xs text-gray-400">
              Maximum file size: 10MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}