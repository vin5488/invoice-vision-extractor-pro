
import React, { useState, useRef } from 'react';
import { Upload, FileUp, X, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setValidationError(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      const errorMessage = "Please upload an image (JPEG, PNG, WebP) or PDF file";
      setValidationError(errorMessage);
      toast({
        title: "Invalid file type",
        description: errorMessage,
        variant: "destructive"
      });
      return;
    }

    if (file.size > maxSize) {
      const errorMessage = "Maximum file size is 10MB";
      setValidationError(errorMessage);
      toast({
        title: "File too large",
        description: errorMessage,
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    onFileSelected(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
        className="hidden"
        disabled={isProcessing}
      />
      
      {validationError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}
      
      {!selectedFile ? (
        <div
          className={`file-drop-area flex flex-col items-center justify-center h-52 rounded-lg p-6 border-2 border-dashed ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          } transition-all duration-200`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload size={40} className="text-gray-400 mb-4" />
          <p className="text-lg font-medium mb-2">Drag & drop your invoice here</p>
          <p className="text-sm text-gray-500 mb-4">Supports: JPEG, PNG, WebP and PDF</p>
          <Button 
            onClick={handleButtonClick} 
            className="bg-gradient-blue hover:opacity-90"
            disabled={isProcessing}
          >
            <FileUp className="mr-2 h-4 w-4" /> Browse Files
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg animate-slide-up">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileUp className="h-5 w-5 text-app-blue" />
            </div>
            <div className="ml-3">
              <p className="font-medium text-sm truncate max-w-[200px] md:max-w-md">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          {!isProcessing && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
