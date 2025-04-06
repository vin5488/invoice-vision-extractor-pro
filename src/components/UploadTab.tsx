
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Wand2 } from 'lucide-react';
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
      <FileUpload 
        onFileSelected={onFileSelected} 
        isProcessing={isProcessing}
      />
      
      {file && !isProcessing && (
        <div className="mt-6">
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
