
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Wand2, UploadCloud, CheckCircle } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import ImagePreview from '@/components/ImagePreview';

interface UploadTabProps {
  file: File | null;
  isProcessing: boolean;
  onFileSelected: (file: File) => void;
  onProcess: () => void;
}

const UploadTab: React.FC<UploadTabProps> = ({ 
  file, 
  isProcessing, 
  onFileSelected, 
  onProcess 
}) => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${file ? 'bg-green-100' : 'bg-blue-100'}`}>
            {file ? <CheckCircle className="h-5 w-5 text-green-600" /> : <UploadCloud className="h-5 w-5 text-blue-600" />}
          </div>
          <h3 className="text-lg font-medium">{file ? 'File Ready' : 'Upload Invoice'}</h3>
        </div>
        
        <FileUpload 
          onFileSelected={onFileSelected} 
          isProcessing={isProcessing}
        />
      </div>
      
      {file && !isProcessing && (
        <div className="mt-6 animate-fade-in">
          <Separator className="my-6" />
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Preview</h3>
            <Button 
              onClick={onProcess}
              disabled={isProcessing || !file}
              className="bg-gradient-blue hover:opacity-90"
            >
              <Wand2 className="mr-2 h-4 w-4" /> Process Invoice
            </Button>
          </div>
          <ImagePreview file={file} processedImageUrl={null} />
        </div>
      )}
    </div>
  );
};

export default UploadTab;
