
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import ImagePreview from '@/components/ImagePreview';
import ExtractedData from '@/components/ExtractedData';
import InvoiceMetadata from '@/components/InvoiceMetadata';

interface ResultsTabProps {
  file: File | null;
  processedImageUrl: string | null;
  extractedData: Array<Array<string>> | null;
  highlightAreas: Array<{x: number, y: number, width: number, height: number}>;
  metadata?: { [key: string]: string };
  onReset: () => void;
}

const ResultsTab: React.FC<ResultsTabProps> = ({
  file,
  processedImageUrl,
  extractedData,
  highlightAreas,
  metadata,
  onReset
}) => {
  if (!extractedData) return null;
  
  return (
    <div className="space-y-8">
      {metadata && Object.keys(metadata).length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Invoice Information</h3>
          <InvoiceMetadata metadata={metadata} />
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Processed Image</h3>
          <ImagePreview 
            file={file} 
            processedImageUrl={processedImageUrl} 
            highlightedAreas={highlightAreas}
          />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-4">Extracted Data</h3>
          <ExtractedData 
            data={extractedData} 
            isLoading={false} 
          />
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <Button 
          onClick={onReset}
          variant="outline"
          className="mr-4"
        >
          Upload New Invoice
        </Button>
        <Button className="bg-gradient-blue hover:opacity-90">
          Process Another Section <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ResultsTab;
